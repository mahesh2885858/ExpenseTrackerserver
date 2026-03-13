import type { FastifyReply, FastifyRequest } from "fastify";
import type { TRegisterBody } from "../schemas/register.schema.ts";
import { register_user } from "../services/register.service.ts";

export async function registerController(
  req: FastifyRequest<{ Body: TRegisterBody }>,
  res: FastifyReply,
) {
  await register_user(req.server.db, req.body);
  return res.send({
    status: "success",
  });
}
