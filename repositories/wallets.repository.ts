import { type DatabaseSync } from "node:sqlite";

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
