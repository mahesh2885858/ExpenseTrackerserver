# Database Schema Documentation

This document describes the database schema used in the Expense Tracker server. The database is implemented using **SQLite**.

## Tables Overview

The database contains the following tables:

1. users
2. refresh_tokens
3. wallets
4. transactions

---

# 1. Users Table

Stores registered user accounts.

| Column   | Type    | Constraints      | Description                    |
| -------- | ------- | ---------------- | ------------------------------ |
| id       | INTEGER | PRIMARY KEY      | Unique identifier for the user |
| username | TEXT    | NOT NULL, UNIQUE | User's login username          |
| password | TEXT    | NOT NULL         | Hashed password                |
| name     | TEXT    | NULL             | Optional display name          |

### Relationships

* One **user** can have multiple **wallets**
* One **user** can have multiple **refresh tokens**

---

# 2. Refresh Tokens Table

Stores refresh tokens issued during authentication.

| Column     | Type    | Constraints           | Description                                                            |
| ---------- | ------- | --------------------- | ---------------------------------------------------------------------- |
| id         | INTEGER | PRIMARY KEY           | Unique identifier for the token                                        |
| token      | TEXT    | NOT NULL              | Refresh token string                                                   |
| user_id    | INTEGER | NOT NULL, FOREIGN KEY | References `users(id)`                                                 |
| revoked    | INTEGER | DEFAULT 0             | Indicates whether the token has been revoked (0 = active, 1 = revoked) |
| expires_at | INTEGER | NULL                  | Expiration timestamp (Unix time)                                       |
| created_at | INTEGER | NULL                  | Token creation timestamp (Unix time)                                   |
| revoked_at | INTEGER | NULL                  | Timestamp when token was revoked                                       |

### Relationships

* Each **refresh token** belongs to exactly **one user**.

---

# 3. Wallets Table

Represents financial accounts belonging to a user.

Examples:

* Cash
* Bank account
* Credit card
* Digital wallet

| Column          | Type    | Constraints           | Description              |
| --------------- | ------- | --------------------- | ------------------------ |
| id              | INTEGER | PRIMARY KEY           | Unique wallet identifier |
| name            | TEXT    | NOT NULL              | Wallet name              |
| initial_balance | INTEGER | DEFAULT 0             | Starting balance         |
| user_id         | INTEGER | NOT NULL, FOREIGN KEY | References `users(id)`   |

### Relationships

* One **user** can own multiple **wallets**
* One **wallet** can contain multiple **transactions**

---

# 4. Transactions Table

Stores all financial transactions associated with wallets.

| Column           | Type    | Constraints           | Description                                |
| ---------------- | ------- | --------------------- | ------------------------------------------ |
| id               | INTEGER | PRIMARY KEY           | Unique transaction identifier              |
| wallet_id        | INTEGER | NOT NULL, FOREIGN KEY | References `wallets(id)`                   |
| type             | TEXT    | NOT NULL              | Transaction type (e.g., income, expense)   |
| amount           | INTEGER | NOT NULL              | Transaction amount                         |
| created_at       | TEXT    | NOT NULL              | Timestamp when the transaction was created |
| transaction_date | TEXT    | NOT NULL              | Actual date of the transaction             |
| description      | TEXT    | DEFAULT NULL          | Optional transaction description           |

### Relationships

* Each **transaction** belongs to exactly **one wallet**

---

# Entity Relationship Overview

```
users
  │
  ├── refresh_tokens
  │
  └── wallets
          │
          └── transactions
```

* A **User** can have multiple **Wallets**
* A **User** can have multiple **Refresh Tokens**
* A **Wallet** can have multiple **Transactions**

---

# Notes

### Boolean Representation in SQLite

SQLite does not have a dedicated boolean type.

| Value | Meaning |
| ----- | ------- |
| 0     | False   |
| 1     | True    |

Example:
`revoked = 1` means the refresh token is revoked.

---

### Timestamp Storage

Two formats are used:

| Format                   | Columns                                               | Reason                      |
| ------------------------ | ----------------------------------------------------- | --------------------------- |
| Unix Timestamp (INTEGER) | `expires_at`, `created_at`, `revoked_at`              | Easy comparisons for expiry |
| TEXT Date                | `created_at`, `transaction_date` (transactions table) | Human readable date storage |
