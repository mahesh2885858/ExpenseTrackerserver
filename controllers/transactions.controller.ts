import type { FastifyReply, FastifyRequest } from "fastify";
import { transactionService } from "../services/transactions.service.ts";
import AppError from "../utils/error.ts";
import type {
  TGetTransactionParams,
  TRemoveTransactionParams,
  TTransactionBody,
  TTransactionUpdateBody,
  TTransactionUpdateParams,
} from "../schemas/transactions.schema.ts";

async function getTransactionsController(
  req: FastifyRequest,
  res: FastifyReply,
) {
  const user = req.user?.id;
  if (!user)
    throw new AppError("Internal error while auth", "INTERNAL_AUTH_ERROR", 500);
  const transactions = transactionService.getByUserId(user, req.server.db);
  return res.send({
    transactions,
  });
}

async function getTransactionController(
  req: FastifyRequest<{ Params: TGetTransactionParams }>,
  res: FastifyReply,
) {
  const transaction = transactionService.getById(req.params.id, req.server.db);
  return res.send({
    transaction,
  });
}

async function postTransactionController(
  req: FastifyRequest<{ Body: TTransactionBody }>,
  res: FastifyReply,
) {
  const user = req.user?.id;
  if (!user)
    throw new AppError("Internal error while auth", "INTERNAL_AUTH_ERROR", 500);
  const result = transactionService.create(req.body, req.server.db);
  return result;
}

async function patchTransaction(
  req: FastifyRequest<{
    Body: TTransactionUpdateBody;
    Params: TTransactionUpdateParams;
  }>,
  res: FastifyReply,
) {
  const result = transactionService.patch(
    req.body,
    req.params.id,
    req.server.db,
  );
  console.log({ result });
  return result;
}

async function removeTransaction(
  req: FastifyRequest<{ Params: TRemoveTransactionParams }>,
  res: FastifyReply,
) {
  return transactionService.remove(req.params.id, req.server.db);
}

export const transactionsController = {
  create: postTransactionController,
  get: getTransactionsController,
  getById: getTransactionController,
  patch: patchTransaction,
  remove: removeTransaction,
};
