# Wallets:

A wallet is pretty self explanatory.

## schema:

| Column          | Type    | Constraints           | Description              |
| --------------- | ------- | --------------------- | ------------------------ |
| id              | INTEGER | PRIMARY KEY           | Unique wallet identifier |
| name            | TEXT    | NOT NULL              | Wallet name              |
| initial_balance | INTEGER | DEFAULT 0             | Starting balance         |
| user_id         | INTEGER | NOT NULL, FOREIGN KEY | References `users(id)`   |


### Relationships

* One **user** can own multiple **wallets**
* One **wallet** can contain multiple **transactions**



We can do following on wallets:

GET: "/wallets"
- It return all the wallets created by current authenticated user.

POST: "/wallets"
- Use this to create a new record.

GET :"/wallets/:id"
- It return the wallet that matches the given id for current authenticated user.

PATCH: "/wallets/:id"
- It updates a part of the wallet record for the given id with the object received in body.
- The body should only contain the fields that should be patched.

DELETE: "/wallets/:id"
- Delete the record with the given id.
- The following will happen in this order:
  - Delete all transactions associated with this wallet.
  - Delete the wallet it self.
  - These are hard deletes. Once deleted, can't be restored.
