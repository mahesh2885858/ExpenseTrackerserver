import Fastify from "fastify";
const fastify = Fastify({
  logger: true,
});

await fastify.register(import("@fastify/swagger"));

await fastify.register(import("@fastify/swagger-ui"), {
  routePrefix: "/documentation",
  uiConfig: {
    docExpansion: "full",
    deepLinking: false,
  },
  uiHooks: {
    onRequest: function (request, reply, next) {
      next();
    },
    preHandler: function (request, reply, next) {
      next();
    },
  },
  staticCSP: true,
  transformStaticCSP: (header) => header,
  transformSpecification: (swaggerObject, request, reply) => {
    return swaggerObject;
  },
  transformSpecificationClone: true,
});

fastify.route({
  method: "get",
  url: "/",
  schema: {
    response: {
      200: {
        type: "object",
        properties: {
          name: {
            type: "string",
          },
        },
      },
    },
  },
  handler: function (req, res) {
    return { name: "online" };
  },
});

// Run the server!
try {
  await fastify.listen({ port: 3000 });
  await fastify.ready();
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
