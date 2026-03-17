import { type FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { walletController } from "../controllers/wallets.controller.ts";
import {
  WalletBodySchema,
  walletDeleteParamsSchema,
  walletReqParamsSchema,
  WalletUpdateBodySchema,
} from "../schemas/wallets.schema.ts";

export const walletsRoute: FastifyPluginAsyncTypebox = async (
  fastify,
  options,
) => {
  fastify.get(
    "/wallets",
    {
      schema: {
        security: [{ bearerAuth: [] }],
      },
    },
    walletController.getWallets,
  );
  fastify.post(
    "/wallets",
    { schema: { body: WalletBodySchema, security: [{ bearerAuth: [] }] } },
    walletController.createWallet,
  );
  fastify.get(
    "/wallets/:id",
    {
      schema: {
        security: [{ bearerAuth: [] }],
        params: walletReqParamsSchema,
      },
    },
    walletController.getWalletById,
  );
  fastify.patch(
    "/wallets/:id",
    {
      schema: {
        security: [{ bearerAuth: [] }],
        params: walletReqParamsSchema,
        body: WalletUpdateBodySchema,
      },
    },
    walletController.updateWallet,
  );
  fastify.delete(
    "/wallets/:id",
    {
      schema: {
        security: [{ bearerAuth: [] }],
        params: walletDeleteParamsSchema,
      },
    },
    walletController.deleteWallet,
  );
};
