CREATE OR REPLACE FUNCTION auspice_reserve_reading(p_user text, p_request uuid, p_tradition text)
RETURNS jsonb LANGUAGE plpgsql AS $$
DECLARE existing auspice_readings; used integer; inserted_id uuid;
BEGIN
  PERFORM pg_advisory_xact_lock(hashtextextended(p_user, 0));
  UPDATE auspice_readings SET status='failed' WHERE user_id=p_user AND status='pending' AND created_at<now()-interval '5 minutes';
  SELECT * INTO existing FROM auspice_readings WHERE user_id=p_user AND request_id=p_request;
  IF FOUND THEN
    IF existing.deleted_at IS NOT NULL THEN RETURN jsonb_build_object('state','deleted'); END IF;
    RETURN jsonb_build_object('state', existing.status, 'id', existing.id, 'reading', existing.result);
  END IF;
  SELECT count(*) INTO used FROM auspice_readings WHERE user_id=p_user
    AND created_at >= date_trunc('month',now() AT TIME ZONE 'UTC') AT TIME ZONE 'UTC'
    AND status IN ('pending','completed');
  IF used>=3 THEN RETURN jsonb_build_object('state','limit'); END IF;
  SELECT count(*) INTO used FROM auspice_readings WHERE user_id=p_user AND created_at>now()-interval '1 hour';
  IF used>=10 THEN RETURN jsonb_build_object('state','rate_limit'); END IF;
  INSERT INTO auspice_readings(user_id,request_id,tradition) VALUES(p_user,p_request,p_tradition) RETURNING id INTO inserted_id;
  RETURN jsonb_build_object('state','reserved','id',inserted_id);
END;
$$;
