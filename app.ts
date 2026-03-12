import { type TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import Fastify from "fastify";
import createDatabasePlugin from "./plugins/createDatabasePlugin.ts";
import user_registration from "./routes/register.route.ts";
import AppError from "./utils/error.ts";
import { DatabaseSync } from "node:sqlite";
import createJWTPlugin from "./plugins/createJWTPlugin.ts";
import { login_user } from "./routes/login.route.ts";
import { authRoute } from "./routes/auth.route.ts";
import { refreshRoute } from "./routes/refresh.route.ts";

type buildOptions = {
  db: DatabaseSync;
  docs?: boolean;
  logger: boolean;
};

async function buildServer(options: buildOptions) {
  const fastify = Fastify({
    logger: options.logger,
  }).withTypeProvider<TypeBoxTypeProvider>();
  if (options?.docs) {
    await fastify.register(import("@fastify/swagger"), {
      openapi: {
        info: {
          title: "Expense Tracker API",
          version: "1.0.0",
        },
        components: {
          securitySchemes: {
            bearerAuth: {
              type: "http",
              description: "some",
              scheme: "bearer",
              bearerFormat: "jwt",
            },
          },
        },
      },
    });

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
  }
  fastify.setErrorHandler((error, req, reply) => {
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        status: "error",
        code: error.code,
        message: error.message,
      });
    }

    req.log.error(error);

    return reply.status(500).send({
      status: "error",
      message: error.message ? error.message : String(error),
    });
  });

  const dataBasePlugin = await createDatabasePlugin(options.db);
  fastify.register(dataBasePlugin);
  fastify.register(createJWTPlugin);
  fastify.route({
    method: "get",
    url: "/",
    handler: function (req, res) {
      return { status: "online" };
    },
  });

  fastify.register(user_registration);
  fastify.register(login_user);
  fastify.register(refreshRoute);
  fastify.register(authRoute);

  return fastify;
}

export default buildServer;
