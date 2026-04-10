import { type SQLInputValue, type DatabaseSync } from "node:sqlite";
import { type TTransactionUpdateBody } from "../schemas/transactions.schema.ts";

const createTransaction = (
  db: DatabaseSync,
  body: {
    walletID: number;
    type: string;
    amount: number;
    createdAt: string;
    transactionDate: string;
    description?: string;
  },
) => {
  const stmt = db.prepare(`
    INSERT INTO transactions (wallet_id,type,amount,created_at,transaction_date,description) VALUES (?,?,?,?,?,?)
    `);
  const { amount, createdAt, transactionDate, type, walletID, description } =
    body;
  return stmt.run(
    walletID,
    type,
    amount,
    createdAt,
    transactionDate,
    description ?? "",
  );
};

const getTransactionsByUserId = (db: DatabaseSync, userId: number) => {
  const stmt = db.prepare(
    `
    SELECT t.* FROM transactions t
    JOIN wallets w ON t.wallet_id = w.id
    WHERE w.user_id=?
    `,
  );
  return stmt.all(userId);
};

const getTransactionById = (db: DatabaseSync, Id: number) => {
  const stmt = db.prepare(
    `
    SELECT * FROM transactions t
    WHERE t.id=?
    `,
  );
  return stmt.get(Id);
};

const patchTransaction = (
  db: DatabaseSync,
  id: number,
  data: TTransactionUpdateBody,
) => {
  const fields = [];
  const values: SQLInputValue[] = [];
  for (const [key, value] of Object.entries(data)) {
    fields.push(`${key}=?`);
    values.push(value as string | number);
  }
  values.push(id);
  const sql = `UPDATE transactions SET ${fields.join(", ")} WHERE id=? RETURNING *`;
  console.log(sql);
  const updateStmt = db.prepare(sql);
  return updateStmt.get(...values);
};

const removeTransaction = (id: number, db: DatabaseSync) => {
  const deleteStmt = db.prepare(`DELETE FROM transactions WHERE id=?`);
  return deleteStmt.run(id);
};

export const transactionsRepository = {
  create: createTransaction,
  getByUserId: getTransactionsByUserId,
  getById: getTransactionById,
  patch: patchTransaction,
  remove: removeTransaction,
};
