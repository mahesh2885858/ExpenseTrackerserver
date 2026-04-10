import { DatabaseSync } from "node:sqlite";
import type {
  TWalletBody,
  TWalletUpdateBody,
} from "../schemas/wallets.schema.ts";
import { walletRepository } from "../repositories/wallets.repository.ts";
import AppError from "../utils/error.ts";
import {
  MAX_WALLET_NAME_LENGTH,
  MIN_WALLET_NAME_LENGTH,
} from "../lib/constants.ts";

const createWalletService = async (
  wallet: TWalletBody,
  userId: number,
  db: DatabaseSync,
) => {
  return walletRepository.create(db, {
    name: wallet.name,
    userId,
    initialBalance: wallet.initialBalance ?? 0,
  });
};

const getWalletsByUser = async (userId: number, db: DatabaseSync) => {
  return walletRepository.getByUser(db, userId);
};

const getWallet = async (id: number, db: DatabaseSync) => {
  return walletRepository.getById(db, id);
};

const updateWallet = async (
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

  const exist = walletRepository.getById(db, id);

  if (!exist) {
    throw new AppError(
      "No wallet found with the given id",
      "WALLET_NOT_FOUND",
      400,
    );
  }

  return walletRepository.patch(db, id, allowedBody);
};

const removeWallet = async (id: number, db: DatabaseSync) => {
  return walletRepository.remove(id, db);
};

export const walletService = {
  getById: getWallet,
  getByUser: getWalletsByUser,
  patch: updateWallet,
  remove: removeWallet,
  create: createWalletService,
};
