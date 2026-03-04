import type { FastifyReply, FastifyRequest } from "fastify";
import type { TLoginBody } from "../schemas/login.schema.ts";
import LoginService from "../services/login.service.ts";

export async function LoginController(
  req: FastifyRequest<{ Body: TLoginBody }>,
  res: FastifyReply,
) {
  const user = await LoginService(req.body, req.server.db);
  return res.send("Mahesh");
}
