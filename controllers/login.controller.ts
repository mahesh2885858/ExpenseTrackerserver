import type { FastifyReply, FastifyRequest } from "fastify";
import type { TLoginBody } from "../schemas/login.schema.ts";
import LoginService from "../services/login.service.ts";
import { randomBytes, randomUUID } from "node:crypto";

export async function LoginController(
  req: FastifyRequest<{ Body: TLoginBody }>,
  res: FastifyReply,
) {
  const loginResults = await LoginService(
    req.body,
    req.server.db,
    req.server.jwt,
  );
  return res.send(loginResults);
}
