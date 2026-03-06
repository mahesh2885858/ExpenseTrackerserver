import Type, { type Static } from "typebox";

export const RegisterBodySchema = Type.Object({
  username: Type.String(),
  password: Type.String(),
});

export type TRegisterBody = Static<typeof RegisterBodySchema>;
