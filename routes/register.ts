import { type FastifyInstance, type FastifyPluginOptions } from "fastify";

async function register(
  fastify: FastifyInstance,
  options: FastifyPluginOptions,
) {
  fastify.route({
    url: "/register",
    method: "POST",
    schema: {
      body: {
        type: "object",
        properties: {
          name: {
            type: "string",
          },
        },
      },
    },
    handler: async function (req, res) {
      console.log({ body: req.body });
      return { name: "mahesh" };
    },
  });
}

export default register;
