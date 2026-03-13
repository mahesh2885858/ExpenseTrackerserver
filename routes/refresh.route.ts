import type { FastifyPluginAsync } from "fastify";
import {
  RefreshTokenPostSchema,
  RefreshTokenResponseSchema,
} from "../schemas/refreshToken.schema.ts";
import { refreshTokenController } from "../controllers/refreshToken.controller.ts";
export const refreshRoute: FastifyPluginAsync = async (fastify, options) => {
  fastify.post(
    "/refresh",
    {
      schema: {
        body: RefreshTokenPostSchema,
        response: RefreshTokenResponseSchema,
      },
    },
    refreshTokenController,
  );
};
