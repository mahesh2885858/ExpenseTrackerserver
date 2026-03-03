import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import Jwt from "../lib/jwt.ts";
import fp from "fastify-plugin";
import AppError from "../utils/error.ts";

const jwtPlugin = (fastify: FastifyInstance, options: FastifyPluginOptions) => {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length === 0) {
    throw new AppError("No secret provided for JWT.", "NO_SECRET", 500);
  }
  const jwt = new Jwt(secret);
  fastify.decorate("jwt", jwt);
  fastify.log.info("Registering JWT!!!!");
};

export default fp(jwtPlugin);
