import { type DatabaseSync } from "node:sqlite";
import { transactionsRepository } from "../repositories/transactions.repository.ts";
import type {
  TTransactionBody,
  TTransactionUpdateBody,
} from "../schemas/transactions.schema.ts";
import AppError from "../utils/error.ts";

const getTransactions = (userId: number, db: DatabaseSync) => {
  return transactionsRepository.getByUserId(db, userId);
};

const getTransaction = (id: number, db: DatabaseSync) => {
  return transactionsRepository.getById(db, id);
};

const postTransactionService = (
  transaction: TTransactionBody,
  db: DatabaseSync,
) => {
  return transactionsRepository.create(db, {
    amount: transaction.amount,
    createdAt: transaction.created_at,
    transactionDate: transaction.transaction_date,
    type: transaction.type,
    walletID: transaction.wallet_id,
    description: transaction.description,
  });
};

const patchTransaction = (
  data: TTransactionUpdateBody,
  id: number,
  db: DatabaseSync,
) => {
  const exist = transactionsRepository.getById(db, id);

  if (!exist) {
    throw new AppError(
      "No Record found with the given id",
      "TRANSACTION_NOT_FOUND",
      400,
    );
  }
  return transactionsRepository.patch(db, id, data);
};

const removeTransaction = (id: number, db: DatabaseSync) => {
  return transactionsRepository.remove(id, db);
};

export const transactionService = {
  create: postTransactionService,
  getByUserId: getTransactions,
  getById: getTransaction,
  patch: patchTransaction,
  remove: removeTransaction,
};
