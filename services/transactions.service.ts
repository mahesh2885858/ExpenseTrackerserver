import { type DatabaseSync } from "node:sqlite";
import {
  createTransaction,
  getTransactionsByUserId,
} from "../repositories/transactions.repository.ts";
import type { TTransactionBody } from "../schemas/transactions.schema.ts";

export const getTransactions = (userId: number, db: DatabaseSync) => {
  return getTransactionsByUserId(db, userId);
};

export const postTransactionService = (
  transaction: TTransactionBody,
  db: DatabaseSync,
) => {
  return createTransaction(db, {
    amount: transaction.amount,
    createdAt: transaction.created_at,
    transactionDate: transaction.transaction_date,
    type: transaction.type,
    walletID: transaction.wallet_id,
    description: transaction.description,
  });
};
