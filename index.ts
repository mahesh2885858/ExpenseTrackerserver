import buildServer from "./app.ts";

const fastify = await buildServer({
  docs: true,
});
try {
  await fastify.listen({ port: 3000 });
  await fastify.ready();
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
