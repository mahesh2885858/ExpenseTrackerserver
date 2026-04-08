import { type FastifyReply, type FastifyRequest } from "fastify";
import { type TForgetPasswordType } from "../schemas/forgetPassword.schema.ts";
import { issueForgetToken } from "../services/forget.service.ts";
import AppError from "../utils/error.ts";

export const forgetPasswordController = (
  req: FastifyRequest<{ Body: TForgetPasswordType }>,
  res: FastifyReply,
) => {
  const email = req.body.email;
  if (!email || email.trim().length === 0)
    throw new AppError("No Email is provided", "INVALID_BODY", 401);
  return issueForgetToken(email, req.server.db);
};
