import Type, { type Static } from "typebox";

export const WalletBodySchema = Type.Object({
  name: Type.String(),
  initialBalance: Type.Number(),
});

export type TWalletBody = Static<typeof WalletBodySchema>;
