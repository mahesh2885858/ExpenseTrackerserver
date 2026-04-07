import { type FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { UserController } from "../controllers/user.controller.ts";
import { UserUpdateBodySchema } from "../schemas/users.schema.ts";

export const userRoute: FastifyPluginAsyncTypebox = async (
  fastify,
  options,
) => {
  fastify.get(
    "/me",
    {
      schema: {
        security: [{ bearerAuth: [] }],
      },
    },
    UserController.get,
  );

  fastify.patch(
    "/me",
    {
      schema: {
        security: [{ bearerAuth: [] }],
        body: UserUpdateBodySchema,
      },
    },
    UserController.patch,
  );

};
