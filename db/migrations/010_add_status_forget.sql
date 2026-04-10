ALTER TABLE forget_password_tokens
ADD COLUMN status TEXT;

ALTER TABLE forget_password_tokens
ADD COLUMN code INTEGER;

ALTER TABLE forget_password_tokens
ADD COLUMN code_created_at INTEGER;

ALTER TABLE forget_password_tokens
RENAME COLUMN ip_address TO code_generated_ip_address;

CREATE UNIQUE INDEX IF NOT EXISTS one_valid_reset_token_per_user
ON forget_password_tokens(user_id)
WHERE used_at IS NULL AND expired_at > strftime('%s','now');
