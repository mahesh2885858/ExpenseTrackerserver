CREATE TABLE IF NOT EXISTS forget_password_tokens(
    id INTEGER PRIMARY KEY,
    token_hash TEXT NOT NULL,
    created_at INTEGER DEFAULT NULL,
    expired_at INTEGER DEFAULT NULL,
    used_at INTEGER DEFAULT NULL,
    ip_address TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
