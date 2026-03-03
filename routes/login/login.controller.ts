import { FastifyReply, FastifyRequest } from "fastify";
import { TLoginBody } from "./login.schema.ts";

export async function LoginController(
  req: FastifyRequest<{ Body: TLoginBody }>,
  res: FastifyReply,
) {
  return res.send("Mahesh");
}
