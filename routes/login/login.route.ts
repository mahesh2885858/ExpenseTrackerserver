import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { LoginBodySchema } from "./login.schema.ts";
import { LoginController } from "./login.controller.ts";

const login: FastifyPluginAsyncTypebox = async (fastify, options) => {
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
