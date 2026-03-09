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
