import { DatabaseSync } from "node:sqlite";
import type {
  TWalletBody,
  TWalletUpdateBody,
} from "../schemas/wallets.schema.ts";
import {
  createWallet,
  getWalletById,
  getWalletsByUserId,
  updateWalletById,
} from "../repositories/wallets.repository.ts";
import AppError from "../utils/error.ts";
import {
  MAX_WALLET_NAME_LENGTH,
  MIN_WALLET_NAME_LENGTH,
} from "../lib/constants.ts";

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

export const getWalletsByUser = async (userId: number, db: DatabaseSync) => {
  return getWalletsByUserId(db, userId);
};

export const getWallet = async (id: number, db: DatabaseSync) => {
  return getWalletById(db, id);
};

export const updateWallet = async (
  id: number,
  body: TWalletUpdateBody,
  db: DatabaseSync,
) => {
  // Ignore all other properties sent
  const allowedBody = {
    initialBalance: body.initialBalance,
    name: body.name,
  };
  if (allowedBody.initialBalance === undefined && !allowedBody.name?.trim()) {
    throw new AppError("No body Provided for updating", "NO_BODY", 400);
  }
  if (allowedBody.name) {
    if (allowedBody.name.trim().length < MIN_WALLET_NAME_LENGTH) {
      throw new AppError(
        "Minimum " +
          MIN_WALLET_NAME_LENGTH +
          " characters needed for wallet name",
        "TOO_LONG",
        400,
      );
    }
    if (allowedBody.name?.trim().length > MAX_WALLET_NAME_LENGTH) {
      throw new AppError(
        "Maximum " +
          MAX_WALLET_NAME_LENGTH +
          " characters allowed for wallet name",
        "TOO_LONG",
        400,
      );
    }
  }

  return updateWalletById(db, id, allowedBody);
};
