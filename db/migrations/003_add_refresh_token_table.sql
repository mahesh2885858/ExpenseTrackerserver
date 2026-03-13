-- Create refresh token table
CREATE TABLE IF NOT EXISTS refresh_tokens(
    id INTEGER PRIMARY KEY,
    token TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
)
