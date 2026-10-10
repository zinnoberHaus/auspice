-- Anonymous daily totals only. No visitor, session, request, or account records.
CREATE TABLE auspice_guide_metrics (
  day date NOT NULL,
  guide text NOT NULL CHECK (length(guide) <= 120 AND guide ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  event text NOT NULL CHECK (event IN ('view', 'open_sanctuary')),
  count integer NOT NULL CHECK (count BETWEEN 1 AND 1000000),
  PRIMARY KEY (day, guide, event)
);
REVOKE ALL ON auspice_guide_metrics FROM PUBLIC;
