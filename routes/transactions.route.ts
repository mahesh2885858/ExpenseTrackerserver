import { type FastifyPluginAsync } from "fastify";

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
    (req, res) => {
      return res.send("getting transactions");
    },
  );
};
