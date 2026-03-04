import type { FastifyReply, FastifyRequest } from "fastify";
import type { TLoginBody } from "../schemas/login.schema.ts";
import LoginService from "../services/login.service.ts";
import { randomBytes, randomUUID } from "node:crypto";

export async function LoginController(
  req: FastifyRequest<{ Body: TLoginBody }>,
  res: FastifyReply,
) {
  const user = await LoginService(req.body, req.server.db);
  const jwt = req.server.jwt;
  const token = jwt.encode({
    username: user.username,
  });
  const refreshToken = randomUUID();
  return res.send({
    name: user.name ?? "",
    accessToken: token,
    refreshToken,
  });
}
