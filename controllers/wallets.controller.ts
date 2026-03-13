import type { FastifyReply, FastifyRequest } from "fastify";
import type { TWalletBody } from "../schemas/wallets.schema.ts";
import {
  createWalletService,
  getWalletsService,
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
  return getWalletsService(req.user.id, req.server.db);
};
