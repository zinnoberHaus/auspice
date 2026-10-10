CREATE TABLE IF NOT EXISTS auspice_readings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  request_id uuid NOT NULL,
  tradition text NOT NULL CHECK (tradition IN ('tarot','iching','astrology','fengshui','synthesis')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','completed','failed')),
  result jsonb,
  note text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz,
  UNIQUE(user_id,request_id)
);
CREATE INDEX IF NOT EXISTS auspice_readings_owner_date ON auspice_readings(user_id,created_at DESC);
CREATE TABLE IF NOT EXISTS auspice_preferences (
  user_id text PRIMARY KEY,
  name text NOT NULL DEFAULT '',
  birth_date date,
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS auspice_interest (
  user_id text PRIMARY KEY,
  plan text NOT NULL CHECK (plan IN ('monthly','annual')),
  created_at timestamptz NOT NULL DEFAULT now()
);
-- The lock spans separate statements under read-committed isolation. Repeated
-- request IDs return the existing result and concurrent requests share the cap.
CREATE OR REPLACE FUNCTION auspice_reserve_reading(p_user text, p_request uuid, p_tradition text)
RETURNS jsonb LANGUAGE plpgsql AS $$
DECLARE existing auspice_readings; used integer; inserted_id uuid;
BEGIN
  PERFORM pg_advisory_xact_lock(hashtextextended(p_user, 0));
  SELECT * INTO existing FROM auspice_readings WHERE user_id=p_user AND request_id=p_request;
  IF FOUND THEN
    RETURN jsonb_build_object('state', existing.status, 'id', existing.id, 'reading', existing.result);
  END IF;
  -- Abandoned reservations do not permanently consume allowance.
  UPDATE auspice_readings SET status='failed' WHERE user_id=p_user AND status='pending' AND created_at<now()-interval '5 minutes';
  SELECT count(*) INTO used FROM auspice_readings WHERE user_id=p_user
    AND created_at >= date_trunc('month',now() AT TIME ZONE 'UTC') AT TIME ZONE 'UTC'
    AND status IN ('pending','completed');
  IF used>=3 THEN RETURN jsonb_build_object('state','limit'); END IF;
  -- Limit failures as well, so upstream outages cannot become an unbounded retry loop.
  SELECT count(*) INTO used FROM auspice_readings WHERE user_id=p_user AND created_at>now()-interval '1 hour';
  IF used>=10 THEN RETURN jsonb_build_object('state','rate_limit'); END IF;
  INSERT INTO auspice_readings(user_id,request_id,tradition) VALUES(p_user,p_request,p_tradition) RETURNING id INTO inserted_id;
  RETURN jsonb_build_object('state','reserved','id',inserted_id);
END;
$$;
REVOKE ALL ON auspice_readings, auspice_preferences, auspice_interest FROM PUBLIC;
REVOKE ALL ON FUNCTION auspice_reserve_reading(text,uuid,text) FROM PUBLIC;
