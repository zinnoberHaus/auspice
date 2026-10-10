-- Keep provider identity deletion and application erasure in one transaction.
-- The existing text user_id remains compatible with the reservation function;
-- its generated UUID provides a database-enforced link to Neon Auth.
-- Existing invalid/orphan owner IDs deliberately fail migration validation:
-- investigate them explicitly rather than silently deleting private records.
ALTER TABLE auspice_readings
  ADD COLUMN IF NOT EXISTS auth_user_id uuid GENERATED ALWAYS AS (user_id::uuid) STORED;
ALTER TABLE auspice_preferences
  ADD COLUMN IF NOT EXISTS auth_user_id uuid GENERATED ALWAYS AS (user_id::uuid) STORED;
ALTER TABLE auspice_interest
  ADD COLUMN IF NOT EXISTS auth_user_id uuid GENERATED ALWAYS AS (user_id::uuid) STORED;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conrelid='auspice_readings'::regclass AND conname='auspice_readings_auth_user_fkey') THEN
    ALTER TABLE auspice_readings ADD CONSTRAINT auspice_readings_auth_user_fkey
      FOREIGN KEY (auth_user_id) REFERENCES neon_auth."user"(id) ON DELETE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conrelid='auspice_preferences'::regclass AND conname='auspice_preferences_auth_user_fkey') THEN
    ALTER TABLE auspice_preferences ADD CONSTRAINT auspice_preferences_auth_user_fkey
      FOREIGN KEY (auth_user_id) REFERENCES neon_auth."user"(id) ON DELETE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conrelid='auspice_interest'::regclass AND conname='auspice_interest_auth_user_fkey') THEN
    ALTER TABLE auspice_interest ADD CONSTRAINT auspice_interest_auth_user_fkey
      FOREIGN KEY (auth_user_id) REFERENCES neon_auth."user"(id) ON DELETE CASCADE;
  END IF;
END;
$$;

CREATE INDEX IF NOT EXISTS auspice_readings_auth_user ON auspice_readings(auth_user_id);
CREATE INDEX IF NOT EXISTS auspice_preferences_auth_user ON auspice_preferences(auth_user_id);
CREATE INDEX IF NOT EXISTS auspice_interest_auth_user ON auspice_interest(auth_user_id);
