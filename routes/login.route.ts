import { type FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { LoginBodySchema } from "../schemas/login.schema.ts";
import { LoginController } from "../controllers/login.controller.ts";

export const login_user: FastifyPluginAsyncTypebox = async (
  fastify,
  options,
) => {
  fastify.post(
    "/login",
    {
      schema: {
        body: LoginBodySchema,
      },
    },
    LoginController,
  );
};
