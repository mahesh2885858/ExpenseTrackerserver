import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import buildServer from "./app.ts";
import { runMigrations } from "./db/runMigrations.ts";

const dirname = import.meta.dirname;
const dbPath = path.join(dirname, "db", "prod.db");
const db = new DatabaseSync(dbPath);
await runMigrations(db);

const fastify = await buildServer({
  docs: true,
  db,
  logger: true,
});
try {
  fastify.listen({ port: parseInt(process.env.Port) || 3000 });
  await fastify.ready();
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
