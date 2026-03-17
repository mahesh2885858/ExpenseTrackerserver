import { type SQLInputValue, type DatabaseSync } from "node:sqlite";

export const createWallet = (
  db: DatabaseSync,
  body: {
    name: string;
    initialBalance?: number;
    userId: number;
  },
) => {
  const initialBalance = body.initialBalance ?? 0;
  const stmt = db.prepare(`
    INSERT INTO wallets (name,initial_balance,user_id) VALUES (?,?,?)
    `);

  return stmt.run(body.name, initialBalance, body.userId);
};

export const getWalletsByUserId = (db: DatabaseSync, userId: number) => {
  const stmt = db.prepare(`SELECT * FROM wallets WHERE user_id=?`);
  return stmt.all(userId);
};

export const getWalletById = (db: DatabaseSync, id: number) => {
  const stmt = db.prepare(`SELECT 1 FROM wallets WHERE id=?`);
  return stmt.get(id);
};

export const updateWalletById = (
  db: DatabaseSync,
  id: number,
  body: Partial<{}>,
) => {
  const fields = [];
  const values: SQLInputValue[] = [];
  for (const [key, value] of Object.entries(body)) {
    if (key === "initialBalance") {
      fields.push(`initial_balance = ?`);
    } else {
      fields.push(`${key} = ?`);
    }
    values.push(value as string | number);
  }
  values.push(id);
  const sql = `UPDATE wallets SET ${fields.join(", ")} WHERE id=? RETURNING *`;
  const updateStmt = db.prepare(sql);
  return updateStmt.get(...values);
};

export const deleteWalletById = (id: number, db: DatabaseSync) => {
  const deleteStmt = db.prepare(`DELETE FROM wallets WHERE id=?`);
  return deleteStmt.run(id);
};
