import type { FastifyReply, FastifyRequest } from "fastify";
import {
  getTransactions,
  postTransactionService,
} from "../services/transactions.service.ts";
import AppError from "../utils/error.ts";
import type { TTransactionBody } from "../schemas/transactions.schema.ts";

export async function getTransactionController(
  req: FastifyRequest,
  res: FastifyReply,
) {
  const user = req.user?.id;
  if (!user)
    throw new AppError("Internal error while auth", "INTERNAL_AUTH_ERROR", 500);
  const transactions = getTransactions(user, req.server.db);
  return res.send({
    transactions,
  });
}

export async function postTransactionController(
  req: FastifyRequest<{ Body: TTransactionBody }>,
  res: FastifyReply,
) {
  const user = req.user?.id;
  if (!user)
    throw new AppError("Internal error while auth", "INTERNAL_AUTH_ERROR", 500);
  const result = postTransactionService(req.body, req.server.db);
  return result;
}
