import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import test from 'node:test';
import { neon } from '@neondatabase/serverless';

// Never loads .env.local or uses DATABASE_URL implicitly.
// AUSPICE_DB_TEST_MODE=rollback AUSPICE_INTEGRATION_DATABASE_URL=... npm test
// The rollback audit creates fixtures only inside a statement that always rolls back.
// Concurrency tests require mode=disposable and a dedicated disposable database:
// they commit temporary identity rows (no credentials, sessions, or email delivery).
const mode = process.env.AUSPICE_DB_TEST_MODE;
const enabled = mode === 'rollback' || mode === 'disposable';
function database() {
  const url = process.env.AUSPICE_INTEGRATION_DATABASE_URL;
  assert.ok(url, 'Set AUSPICE_INTEGRATION_DATABASE_URL explicitly; production is never selected automatically.');
  return neon(url);
}

test('DB: identity deletion erases all owned data, rejects orphan recreation, and preserves another owner', {
  skip: enabled ? false : 'Set AUSPICE_DB_TEST_MODE=rollback and an explicit integration database URL.',
}, async () => {
  const sql = database();
  await assert.rejects(sql.query(`
    DO $$
    DECLARE owner_id uuid := gen_random_uuid(); other_id uuid := gen_random_uuid();
      owner_reading uuid; other_reading uuid; affected integer;
    BEGIN
      INSERT INTO neon_auth."user" (id,name,email,"emailVerified") VALUES
        (owner_id,'Rollback audit','auspice-rollback-' || owner_id::text || '@example.invalid',true),
        (other_id,'Rollback audit','auspice-rollback-' || other_id::text || '@example.invalid',true);
      INSERT INTO auspice_readings(user_id,request_id,tradition,status,result,note)
        VALUES(owner_id::text,gen_random_uuid(),'tarot','completed','{"audit":true}','private audit note')
        RETURNING id INTO owner_reading;
      INSERT INTO auspice_readings(user_id,request_id,tradition,status,result)
        VALUES(other_id::text,gen_random_uuid(),'tarot','completed','{"other":true}')
        RETURNING id INTO other_reading;
      INSERT INTO auspice_preferences(user_id,name) VALUES(owner_id::text,'Owner'),(other_id::text,'Other');
      INSERT INTO auspice_interest(user_id,plan) VALUES(owner_id::text,'monthly'),(other_id::text,'annual');

      -- The exact API ownership predicates must not mutate another user's row.
      UPDATE auspice_readings SET note='unauthorized' WHERE id=other_reading AND user_id=owner_id::text AND deleted_at IS NULL AND status='completed';
      GET DIAGNOSTICS affected = ROW_COUNT;
      IF affected <> 0 THEN RAISE EXCEPTION 'Cross-owner update succeeded'; END IF;
      UPDATE auspice_readings SET result=NULL,note='',deleted_at=now() WHERE id=other_reading AND user_id=owner_id::text AND deleted_at IS NULL;
      GET DIAGNOSTICS affected = ROW_COUNT;
      IF affected <> 0 THEN RAISE EXCEPTION 'Cross-owner deletion succeeded'; END IF;

      -- Deleting the identity through ANY provider path must cascade atomically.
      DELETE FROM neon_auth."user" WHERE id=owner_id;
      IF EXISTS(SELECT 1 FROM auspice_readings WHERE user_id=owner_id::text)
        OR EXISTS(SELECT 1 FROM auspice_preferences WHERE user_id=owner_id::text)
        OR EXISTS(SELECT 1 FROM auspice_interest WHERE user_id=owner_id::text)
      THEN RAISE EXCEPTION 'Identity deletion left private data behind'; END IF;
      IF NOT EXISTS(SELECT 1 FROM auspice_readings WHERE id=other_reading AND result='{"other":true}'::jsonb AND deleted_at IS NULL)
        OR NOT EXISTS(SELECT 1 FROM auspice_preferences WHERE user_id=other_id::text)
        OR NOT EXISTS(SELECT 1 FROM auspice_interest WHERE user_id=other_id::text)
      THEN RAISE EXCEPTION 'Identity deletion affected another owner'; END IF;

      -- Requests authenticated just before deletion cannot recreate orphan data.
      BEGIN
        PERFORM auspice_reserve_reading(owner_id::text,gen_random_uuid(),'tarot');
        RAISE EXCEPTION 'Reservation accepted a deleted identity';
      EXCEPTION WHEN foreign_key_violation THEN NULL; END;
      BEGIN
        INSERT INTO auspice_preferences(user_id,name) VALUES(owner_id::text,'orphan');
        RAISE EXCEPTION 'Preferences accepted a deleted identity';
      EXCEPTION WHEN foreign_key_violation THEN NULL; END;
      BEGIN
        INSERT INTO auspice_interest(user_id,plan) VALUES(owner_id::text,'monthly');
        RAISE EXCEPTION 'Interest accepted a deleted identity';
      EXCEPTION WHEN foreign_key_violation THEN NULL; END;

      -- Even successful audit fixtures must never remain in the database.
      RAISE EXCEPTION 'AUSPICE_AUDIT_ROLLBACK_OK';
    END;
    $$;
  `), (error: unknown) => error instanceof Error && error.message.includes('AUSPICE_AUDIT_ROLLBACK_OK'));
});

test('DB: concurrent reservations share one allowance, replay one request, and serialize with account deletion', {
  skip: mode === 'disposable' ? false : 'Requires AUSPICE_DB_TEST_MODE=disposable on a dedicated disposable database.',
}, async () => {
  const sql = database();
  const owner = randomUUID();
  const other = randomUUID();
  try {
    await sql`INSERT INTO neon_auth."user" (id,name,email,"emailVerified") VALUES
      (${owner}::uuid,'Concurrency audit',${`auspice-concurrency-${owner}@example.invalid`},true),
      (${other}::uuid,'Concurrency audit',${`auspice-concurrency-${other}@example.invalid`},true)`;
    const sameRequest = randomUUID();
    const replay = await Promise.all(Array.from({ length: 8 }, () => sql`SELECT auspice_reserve_reading(${owner},${sameRequest}::uuid,'tarot') AS reservation`));
    assert.equal(replay.filter((rows) => rows[0].reservation.state === 'reserved').length, 1);
    assert.equal(replay.filter((rows) => rows[0].reservation.state === 'pending').length, 7);
    assert.equal(new Set(replay.map((rows) => rows[0].reservation.id)).size, 1);

    const attempts = await Promise.all(Array.from({ length: 12 }, () => sql`SELECT auspice_reserve_reading(${owner},${randomUUID()}::uuid,'tarot') AS reservation`));
    assert.equal(attempts.filter((rows) => rows[0].reservation.state === 'reserved').length, 2);
    assert.equal(attempts.filter((rows) => rows[0].reservation.state === 'limit').length, 10);
    assert.equal((await sql`SELECT count(*)::int AS count FROM auspice_readings WHERE user_id=${owner}`)[0].count, 3);
    assert.equal((await sql`SELECT auspice_reserve_reading(${other},${randomUUID()}::uuid,'tarot') AS reservation`)[0].reservation.state, 'reserved');

    // This owner still has room, so the race exercises an actual INSERT/FK lock.
    const race = await Promise.allSettled([
      sql`SELECT auspice_reserve_reading(${other},${randomUUID()}::uuid,'tarot') AS reservation`,
      sql`DELETE FROM neon_auth."user" WHERE id=${other}::uuid`,
    ]);
    assert.equal(race[1].status, 'fulfilled');
    if (race[0].status === 'rejected') assert.equal((race[0].reason as { code?: string }).code, '23503');
    assert.equal((await sql`SELECT count(*)::int AS count FROM auspice_readings WHERE user_id=${other}`)[0].count, 0);
    assert.equal((await sql`SELECT count(*)::int AS count FROM auspice_readings WHERE user_id=${owner}`)[0].count, 3);
  } finally {
    await sql`DELETE FROM neon_auth."user" WHERE id IN (${owner}::uuid,${other}::uuid)`;
  }
});
