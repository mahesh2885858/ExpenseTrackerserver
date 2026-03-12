import { type FastifyPluginAsync } from "fastify";
import { transactionsRoute } from "./transactions.route.ts";
import { walletsRoute } from "./wallets.route.ts";
import AppError from "../utils/error.ts";

export const authRoute: FastifyPluginAsync = async (fastify, options) => {
  fastify.addHook("preHandler", async (req, res) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader)
      throw new AppError("User not authenticated", "UNAUTHORIZED", 401);
    const [authScheme, token] = authHeader.split(" ");
    if (!authScheme || authScheme !== "Bearer")
      throw new AppError(
        "Invalid authentication scheme.",
        "INVALID_TOKEN",
        401,
      );
    if (!token || token.length === 0)
      throw new AppError("Invalid token", "INVALID_TOKEN", 401);
    const { isValid, payload, isExpired } = req.server.jwt.decode(token);
    if (!isValid)
      throw new AppError("User not authenticated", "UNAUTHORIZED", 401);
    if (isExpired) throw new AppError("Token Expired", "EXPIRED", 401);
    if (!payload?.sub)
      throw new AppError("User not authenticated", "UNAUTHORIZED", 401);
    req.user = {
      id: payload.sub,
    };
  });

  fastify.register(transactionsRoute);
  fastify.register(walletsRoute);
};
