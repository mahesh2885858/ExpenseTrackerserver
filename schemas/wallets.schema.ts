import Type, { type Static } from "typebox";

export const WalletBodySchema = Type.Object({
  name: Type.String(),
  initialBalance: Type.Number(),
});
export type TWalletBody = Static<typeof WalletBodySchema>;

export const walletReqParamsSchema = Type.Object({
  id: Type.Number(),
});
export type TParamsWallet = Static<typeof walletReqParamsSchema>;

export const WalletUpdateBodySchema = Type.Object({
  name: Type.Optional(Type.String()),
  initialBalance: Type.Optional(Type.Number()),
});

export type TWalletUpdateBody = Static<typeof WalletUpdateBodySchema>;

export const walletDeleteParamsSchema = Type.Object({
  id: Type.Number(),
});
export type TDeleteWalletParams = Static<typeof walletReqParamsSchema>;
