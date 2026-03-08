import { type FastifyPluginAsync } from "fastify";

export const transactionsRoute: FastifyPluginAsync = async (
  fastify,
  options,
) => {
  fastify.get("/transactions", (req, res) => {
    return res.send("getting transactions");
  });
};
