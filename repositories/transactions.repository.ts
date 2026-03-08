import { type DatabaseSync } from "node:sqlite";

export const createTransaction = (
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
