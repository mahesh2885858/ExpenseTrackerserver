import { type FastifyPluginAsync } from "fastify";
import { transactionsRoute } from "./transactions.route.ts";
import { walletsRoute } from "./wallets.route.ts";
import AppError from "../utils/error.ts";

export const authRoute: FastifyPluginAsync = async (fastify, options) => {
  fastify.addHook("preHandler", async (req, res) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader)
      throw new AppError("User not authenticated", "UNAUTHORIZED", 400);
    const [authScheme, token] = authHeader.split(" ");
    if (!authScheme || authScheme !== "Bearer")
      throw new Error("Invalid authentication scheme.");
    if (!token || token.length === 0)
      throw new AppError("Invalid token", "INVALID_TOKEN", 400);
    const { isValid, payload } = req.server.jwt.decode(token);
    if (!isValid)
      throw new AppError("User not authenticated", "UNAUTHORIZED", 400);
    if (!payload?.id)
      throw new AppError("User not authenticated", "UNAUTHORIZED", 400);
    req.user = {
      id: payload.id,
    };
  });

  fastify.register(transactionsRoute);
  fastify.register(walletsRoute);
};
