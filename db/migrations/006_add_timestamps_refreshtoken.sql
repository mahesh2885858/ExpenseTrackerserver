ALTER TABLE refresh_tokens
ADD COLUMN expires_at INTEGER;

ALTER TABLE refresh_tokens
ADD COLUMN created_at INTEGER ;
