import type { FastifyReply, FastifyRequest } from "fastify";
import type { TUserUpdateBody } from "../schemas/users.schema.ts";
import { userService } from "../services/user.service.ts";

export const getUserController = async (
  req: FastifyRequest,
  res: FastifyReply,
) => {
  // Todo validate input
  const user = await userService.get(req.user.id, req.server.db);
  return user;
};

export const patchUser = async (
  req: FastifyRequest<{ Body: TUserUpdateBody }>,
  res: FastifyReply,
) => {
  return await userService.patch(req.user.id, req.body, req.server.db);
};

export const UserController = {
  get: getUserController,
  patch: patchUser,
};
