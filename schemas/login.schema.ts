import Type, { type Static } from "typebox";
import {
  MAX_PASSWORD_LENGTH,
  MAX_USERNAME_LENGTH,
  MIN_PASSWORD_LENGTH,
  MIN_USERNAME_LENGTH,
} from "../lib/constants.ts";

export const LoginBodySchema = Type.Object({
  username: Type.String({
    minLength: MIN_USERNAME_LENGTH,
    maxLength: MAX_USERNAME_LENGTH,
  }),
  password: Type.String({
    minLength: MIN_PASSWORD_LENGTH,
    maxLength: MAX_PASSWORD_LENGTH,
  }),
});

export type TLoginBody = Static<typeof LoginBodySchema>;
