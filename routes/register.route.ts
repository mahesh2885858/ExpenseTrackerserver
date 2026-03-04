import { type FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { RegisterBodySchema } from "../schemas/register.schema.ts";
import { registerController } from "../controllers/register.controller.ts";

const user_registration: FastifyPluginAsyncTypebox = async function (
  fastify,
  options,
) {
  fastify.post(
    "/register",
    {
      schema: {
        body: RegisterBodySchema,
      },
    },
    registerController,
  );
};

export default user_registration;
