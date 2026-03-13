import Type, { type Static } from "typebox";

export const LoginBodySchema = Type.Object({
  username: Type.String(),
  password: Type.String(),
});

export type TLoginBody = Static<typeof LoginBodySchema>;
