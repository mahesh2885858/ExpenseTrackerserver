import { type FastifyPluginOptions, type FastifyInstance } from "fastify";
import { DatabaseSync } from "node:sqlite";
import fp from "fastify-plugin";
import type Jwt from "../lib/jwt.ts";

declare module "fastify" {
  interface FastifyInstance {
    db: DatabaseSync;
    jwt: Jwt;
  }
}

async function createDatabasePlugin(db: DatabaseSync) {
  return fp(async function (
    fastify: FastifyInstance,
    options: FastifyPluginOptions,
  ) {
    fastify.decorate("db", db);
    fastify.addHook("onClose", async () => {
      db.close();
    });
    fastify.log.info("Registering sqlite...");
  });
}

export default createDatabasePlugin;
