import { type FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { walletController } from "../controllers/wallets.controller.ts";
import {
  WalletBodySchema,
  walletReqParamsSchema,
  WalletUpdateBodySchema,
} from "../schemas/wallets.schema.ts";

export const walletsRoute: FastifyPluginAsyncTypebox = async (
  fasity,
  options,
) => {
  fasity.get(
    "/wallets",
    {
      schema: {
        security: [{ bearerAuth: [] }],
      },
    },
    walletController.getWallets,
  );
  fasity.post(
    "/wallets",
    { schema: { body: WalletBodySchema, security: [{ bearerAuth: [] }] } },
    walletController.createWallet,
  );
  fasity.get(
    "/wallets/:id",
    {
      schema: {
        security: [{ bearerAuth: [] }],
        params: walletReqParamsSchema,
      },
    },
    walletController.getWalletById,
  );
  fasity.patch(
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
};
