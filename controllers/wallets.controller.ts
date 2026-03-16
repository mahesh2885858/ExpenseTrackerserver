import type { FastifyReply, FastifyRequest } from "fastify";
import type {
  TParamsWallet,
  TWalletBody,
  TWalletUpdateBody,
} from "../schemas/wallets.schema.ts";
import {
  createWalletService,
  getWallet,
  getWalletsByUser,
  updateWallet,
} from "../services/wallets.service.ts";

export const postWalletController = async (
  req: FastifyRequest<{
    Body: TWalletBody;
  }>,
  res: FastifyReply,
) => {
  // Todo validate input
  return createWalletService(
    { initialBalance: req.body.initialBalance ?? 0, name: req.body.name },
    req.user.id,
    req.server.db,
  );
};

export const getWalletsController = async (
  req: FastifyRequest,
  res: FastifyReply,
) => {
  // Todo validate input
  const wallets = await getWalletsByUser(req.user.id, req.server.db);
  return wallets;
};

export const getWalletController = async (
  req: FastifyRequest<{ Params: TParamsWallet }>,
  res: FastifyReply,
) => {
  return await getWallet(req.params.id, req.server.db);
};

export const patchWallet = async (
  req: FastifyRequest<{ Params: TParamsWallet; Body: TWalletUpdateBody }>,
  res: FastifyReply,
) => {
  return await updateWallet(req.params.id, req.body, req.server.db);
};

export const walletController = {
  createWallet: postWalletController,
  getWallets: getWalletsController,
  getWalletById: getWalletController,
  updateWallet: patchWallet,
};
