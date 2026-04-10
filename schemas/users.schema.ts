import Type, { type Static } from "typebox";
export const UserUpdateBodySchema = Type.Object({
  name: Type.Optional(Type.String()),
  email: Type.Optional(Type.String()),
});

export type TUserUpdateBody = Static<typeof UserUpdateBodySchema>;
