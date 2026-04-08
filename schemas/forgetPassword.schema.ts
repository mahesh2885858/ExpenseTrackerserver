import Type, { type Static } from "typebox";

export const ForgetPasswordSchema = Type.Object({
  email: Type.String(),
});

export type TForgetPasswordType = Static<typeof ForgetPasswordSchema>;
