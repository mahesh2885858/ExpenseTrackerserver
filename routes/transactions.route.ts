import { type FastifyPluginAsync } from "fastify";
import { transactionsController } from "../controllers/transactions.controller.ts";
import {
  GetTransactionParamsSchema,
  RemoveTransactionParamsSchema,
  TransactionBodySchema,
  TransactionUpdateParamsSchema,
} from "../schemas/transactions.schema.ts";

export const transactionsRoute: FastifyPluginAsync = async (
  fastify,
  options,
) => {
  fastify.get(
    "/transactions",
    {
      schema: {
        security: [{ bearerAuth: [] }],
      },
    },
    transactionsController.get,
  );
  fastify.post(
    "/transactions",
    {
      schema: {
        body: TransactionBodySchema,
        security: [{ bearerAuth: [] }],
      },
    },
    transactionsController.create,
  );
  fastify.get(
    "/transactions/:id",
    {
      schema: {
        security: [{ bearerAuth: [] }],
        params: GetTransactionParamsSchema,
      },
    },
    transactionsController.getById,
  );
  fastify.patch(
    "/transactions/:id",
    {
      schema: {
        security: [{ bearerAuth: [] }],
        params: TransactionUpdateParamsSchema,
        body: TransactionBodySchema,
      },
    },
    transactionsController.patch,
  );
  fastify.delete(
    "/transactions/:id",
    {
      schema: {
        security: [{ bearerAuth: [] }],
        params: RemoveTransactionParamsSchema,
      },
    },
    transactionsController.remove,
  );
};
