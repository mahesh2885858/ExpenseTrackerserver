import { randomUUID } from "node:crypto";

export const generateRefreshToken = () => {
  const token = randomUUID();
  return token;
};
