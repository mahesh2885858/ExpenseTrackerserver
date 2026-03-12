import Type, { type Static } from "typebox";

export const RefreshTokenPostSchema = Type.Object({
  refreshToken: Type.String(),
});

export const RefreshTokenResponseSchema = {
  201: Type.Object({
    accessToken: Type.String(),
    refreshToken: Type.String(),
  }),
};

export type TRefreshTokenPost = Static<typeof RefreshTokenPostSchema>;
