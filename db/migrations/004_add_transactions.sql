CREATE TABLE IF NOT EXISTS wallets(
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    initial_balance INTEGER DEFAULT 0,
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS transactions(
    id INTEGER PRIMARY KEY,
    wallet_id INTEGER NOT NULL,
    type TEXT NOT NULL,
    amount INTEGER NOT NULL,
    created_at TEXT NOT NULL,
    transaction_date TEXT NOT NULL,
    description TEXT DEFAULT NULL,
    FOREIGN KEY (wallet_id) REFERENCES wallets(id)
);
