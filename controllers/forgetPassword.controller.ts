import { type FastifyReply, type FastifyRequest } from "fastify";
import { type TForgetPasswordType } from "../schemas/forgetPassword.schema.ts";
import { issueForgetToken } from "../services/forget.service.ts";
import AppError from "../utils/error.ts";

export const forgetPasswordController = async(
  req: FastifyRequest<{ Body: TForgetPasswordType }>,
  res: FastifyReply,
) => {
  const email = req.body.email;
  if (!email || email.trim().length === 0)
    throw new AppError("No Email is provided", "INVALID_BODY", 401);
  await issueForgetToken(email, req.server.db);
  return {
    message:"If an account exist with the email, an email with link to reset password has sent."
  }
};
