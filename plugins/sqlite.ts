import { type FastifyPluginOptions, type FastifyInstance } from "fastify";
import { DatabaseSync } from "node:sqlite";
import fp from "fastify-plugin";

declare module "fastify" {
  interface FastifyInstance {
    db: DatabaseSync;
  }
}

async function sqlite(fastify: FastifyInstance, options: FastifyPluginOptions) {
  const db = new DatabaseSync("./db/dev.db");
  fastify.decorate("db", db);
  fastify.addHook("onClose", async () => {
    db.close();
  });
  fastify.log.info("Registering sqlite...");
}
export default fp(sqlite);
