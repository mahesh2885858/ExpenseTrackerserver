import { type FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";

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
    (req, res) => {
      res.send("Sending all the wallets");
    },
  );
};
