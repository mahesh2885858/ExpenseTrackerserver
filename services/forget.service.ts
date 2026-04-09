import { type DatabaseSync } from "node:sqlite";
import { usersRepository } from "../repositories/user.repository.ts";
import AppError from "../utils/error.ts";
import { forgetTokenRepository } from "../repositories/forgetTokens.repository.ts";
import { createHmac, randomBytes } from "node:crypto";

const createTokenAndHash = () => {
  const rawToken = randomBytes(32).toString("hex")
  const tokenHash = createHmac("sha256", process.env.FORGET_TOKEN_SECRET as string).update(rawToken).digest("hex")
  return {rawToken,tokenHash}
}

export const issueForgetToken = async (
  email: string,
  db: DatabaseSync,
) => {
  const existingUser =await usersRepository.getByEmail(db,email)
  if (!existingUser||!existingUser.id) throw new AppError("No record found with the given email", "NOT_FOUND", 400,)
  // check whether a forget token already exist for this user or not
  const existingToken = await forgetTokenRepository.getByUserId(db,Number(existingUser.id))
  if (existingToken) {
    // Mark as completed and issue a new one
    try {
      db.exec("BEGIN IMMEDIATE TRANSACTION");
      await forgetTokenRepository.markTokenAsUsed(db, Number(existingToken.id))
      const tokens = createTokenAndHash()
      await forgetTokenRepository.createNewToken(db, tokens.tokenHash, Number(existingUser.id))
      db.exec("COMMIT");
    } catch (e) {
      db.exec("ROLLBACK");
      throw new Error(e)
    }
    // TODO: Construct url and sent email to user

  } else {
    // create a new one
    // Todo: repeated code. refactor later
    const tokens = createTokenAndHash()
    await forgetTokenRepository.createNewToken(db,tokens.tokenHash,Number(existingUser.id))
  }
  // todo return a successful response
};
