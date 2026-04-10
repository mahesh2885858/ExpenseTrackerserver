import { type FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { forgetPasswordController } from "../controllers/forgetPassword.controller.ts";
import { ForgetPasswordSchema } from "../schemas/forgetPassword.schema.ts";

export const forget_password_route: FastifyPluginAsyncTypebox = async (
  fastify,
  options,
) => {
  fastify.post(
    "/forget-password",
    {
      schema: {
        body: ForgetPasswordSchema,
      },
    },
  forgetPasswordController,
  );
};
