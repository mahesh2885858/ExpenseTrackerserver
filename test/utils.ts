import { type FastifyInstance } from "fastify";

export const registerDummyUser = async (app: FastifyInstance) => {
  const user = {
    username: "mahesh",
    password: "12345678",
  };
  const user_one_created = await app.inject({
    method: "POST",
    url: "/register",
    body: user,
  });
};
