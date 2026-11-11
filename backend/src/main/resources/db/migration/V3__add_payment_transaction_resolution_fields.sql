-- Add missing resolution audit columns for PaymentTransaction
ALTER TABLE payment_transactions
    ADD COLUMN IF NOT EXISTS resolution_status VARCHAR(30),
    ADD COLUMN IF NOT EXISTS resolved_by INT,
    ADD COLUMN IF NOT EXISTS resolved_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS resolution_note VARCHAR(500);
