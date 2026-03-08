import { type FastifyPluginAsync } from "fastify";
import { transactionsRoute } from "./transactions.route.ts";
import { walletsRoute } from "./wallets.route.ts";
import AppError from "../utils/error.ts";

export const authRoute: FastifyPluginAsync = async (fastify, options) => {
  fastify.addHook("preHandler", async (req, res) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader)
      throw new AppError("User not authenticated", "UNAUTHORIZED", 400);
  });
  fastify.register(transactionsRoute);
  fastify.register(walletsRoute);
};
