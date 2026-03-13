import { type FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { WalletBodySchema } from "../schemas/wallets.schema.ts";
import {
  getWalletsController,
  postWalletController,
} from "../controllers/wallets.controller.ts";

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
    getWalletsController,
  );
  fasity.post(
    "/wallets",
    { schema: { body: WalletBodySchema, security: [{ bearerAuth: [] }] } },
    postWalletController,
  );
};
