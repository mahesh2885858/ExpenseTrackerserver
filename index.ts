import buildServer from "./app.ts";

const fastify = await buildServer({
  docs: true,
  db: "./db/dev.db",
});
try {
  fastify.listen({ port: parseInt(process.env.PORT) || 3000 });
  await fastify.ready();
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
