import { DatabaseSync } from "node:sqlite";
import type { TWalletBody } from "../schemas/wallets.schema.ts";
import {
  createWallet,
  getWalletsByUserId,
} from "../repositories/wallets.repository.ts";

export const createWalletService = async (
  wallet: TWalletBody,
  userId: number,
  db: DatabaseSync,
) => {
  return createWallet(db, {
    name: wallet.name,
    userId,
    initialBalance: wallet.initialBalance ?? 0,
  });
};

export const getWalletsService = async (userId: number, db: DatabaseSync) => {
  return getWalletsByUserId(db, userId);
};
