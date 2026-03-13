import { type FastifyInstance } from "fastify";

const user = {
  username: "mahesh",
  password: "12345678",
};
export const registerDummyUser = async (app: FastifyInstance) => {
  const user_one_created = await app.inject({
    method: "POST",
    url: "/register",
    body: user,
  });
};

export const getValidAccessAndJwtToken = async (app: FastifyInstance) => {
  const userLoggedIn = await app.inject({
    method: "POST",
    url: "/login",
    body: user,
  });
  return JSON.parse(userLoggedIn.body);
};
