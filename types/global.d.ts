import { DatabaseSync } from "node:sqlite";
import type Jwt from "../lib/jwt";

declare module "fastify" {
  interface FastifyInstance {
    db: DatabaseSync;
    jwt: Jwt;
  }
  interface FastifyRequest {
    user?: {
      id: number;
    };
  }
}
