import { type FastifyReply, type FastifyRequest } from "fastify";
import { type TRefreshTokenPost } from "../schemas/refreshToken.schema.ts";
import AppError from "../utils/error.ts";
import { issueRefreshToken } from "../services/refreshToken.service.ts";

export const refreshTokenController = (
  req: FastifyRequest<{ Body: TRefreshTokenPost }>,
  res: FastifyReply,
) => {
  const refreshToken = req.body.refreshToken;
  if (!refreshToken || refreshToken.trim().length === 0)
    throw new AppError("No Refresh token provided", "NO_REFRESH_TOKEN", 401);
  return issueRefreshToken(refreshToken, req.server.jwt, req.server.db);
};
