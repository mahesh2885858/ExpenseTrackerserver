import Type, { type Static } from "typebox";

export const TransactionBodySchema = Type.Object({
  wallet_id: Type.Number(),
  type: Type.String(),
  amount: Type.Number(),
  created_at: Type.String(),
  transaction_date: Type.String(),
  description: Type.String(),
});

export type TTransactionBody = Static<typeof TransactionBodySchema>;

export const GetTransactionParamsSchema = Type.Object({
  id: Type.Number(),
});

export type TGetTransactionParams = Static<typeof GetTransactionParamsSchema>;

export const TransactionUpdateBodySchema = Type.Object(
  {
    wallet_id: Type.Optional(Type.Number),
    amount: Type.Optional(Type.Number()),
    type: Type.Optional(Type.String()),
    created_at: Type.Optional(Type.String()),
    transaction_date: Type.Optional(Type.String()),
    description: Type.Optional(Type.String()),
  },
  {
    additionalProperties: false,
    minProperties: 1,
  },
);
export const TransactionUpdateParamsSchema = Type.Object({
  id: Type.Number(),
});

export type TTransactionUpdateBody = Static<typeof TransactionUpdateBodySchema>;
export type TTransactionUpdateParams = Static<
  typeof TransactionUpdateParamsSchema
>;

export const RemoveTransactionParamsSchema = Type.Object({
  id: Type.Number(),
});

export type TRemoveTransactionParams = Static<
  typeof RemoveTransactionParamsSchema
>;
