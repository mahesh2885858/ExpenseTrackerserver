import { type FastifyPluginAsync } from "fastify";
import {
  getTransactionController,
  postTransactionController,
} from "../controllers/transactions.controller.ts";
import { TransactionBodySchema } from "../schemas/transactions.schema.ts";

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
    getTransactionController,
  );
  fastify.post(
    "/transactions",
    {
      schema: {
        body: TransactionBodySchema,
        security: [{ bearerAuth: [] }],
      },
    },
    postTransactionController,
  );
};
