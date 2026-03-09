ALTER TABLE store_claims DROP CONSTRAINT IF EXISTS store_claims_status_check;

ALTER TABLE store_claims ADD CONSTRAINT store_claims_status_check
  CHECK (status IN ('pending', 'processing', 'ready', 'claimed', 'cancelled', 'failed', 'awaiting_connection'));
