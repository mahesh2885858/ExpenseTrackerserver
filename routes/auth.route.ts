import { type FastifyPluginAsync } from "fastify";
import { transactionsRoute } from "./transactions.route.ts";

export const authRoute: FastifyPluginAsync = async (fastify, options) => {
  fastify.addHook("preHandler", async (req, res) => {});
  fastify.register(transactionsRoute);
};
