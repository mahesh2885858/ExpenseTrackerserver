import { type FastifyInstance, type FastifyPluginOptions } from "fastify";
import fp from "fastify-plugin";
import { DatabaseSync } from "node:sqlite";

async function createDatabasePlugin(db: DatabaseSync) {
  return fp(async function (
    fastify: FastifyInstance,
    options: FastifyPluginOptions,
  ) {
    db.exec("PRAGMA foreign_keys = ON;");
    fastify.decorate("db", db);
    fastify.addHook("onClose", async () => {
      db.close();
    });
    fastify.log.info("Registering sqlite...");
  });
}

export default createDatabasePlugin;
