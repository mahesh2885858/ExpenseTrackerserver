import { createHmac, randomBytes } from "node:crypto";
import { type DatabaseSync } from "node:sqlite";
import { forgetTokenRepository } from "../repositories/forgetTokens.repository.ts";
import { usersRepository } from "../repositories/user.repository.ts";
import AppError from "../utils/error.ts";
import { getCurrentUnixTimestamp } from "../utils/getCurrentUnixTimeStamp.ts";

const createTokenAndHash = () => {
  const rawToken = randomBytes(32).toString("hex");
  const tokenHash = createHmac(
    "sha256",
    process.env.FORGET_TOKEN_SECRET as string,
  )
    .update(rawToken)
    .digest("hex");
  return { rawToken, tokenHash };
};

export const issueForgetToken = async (email: string, db: DatabaseSync) => {
  const existingUser = await usersRepository.getByEmail(db, email);
  // No need to send the error here to user since we don't want the un authenticated user to know an email exist or not in our system.
  if (!existingUser || !existingUser.id) return;
  // check whether a forget token already exist for this user or not
  const existingToken = await forgetTokenRepository.getByUserId(
    db,
    Number(existingUser.id),
  );
  try {
    db.exec("BEGIN IMMEDIATE TRANSACTION");
    if (existingToken) {
      // Mark as completed and issue a new one
      await forgetTokenRepository.markTokenAsUsed(db, Number(existingToken.id));
    }
    // create a new one
    const tokens = createTokenAndHash();
    await forgetTokenRepository.createNewToken(
      db,
      tokens.tokenHash,
      Number(existingUser.id),
    );
    // TODO: Construct url and sent email to user and should be handled by  a function.
    db.exec("COMMIT");
  } catch (e) {
    db.exec("ROLLBACK");
    throw e instanceof Error ? e : new Error("Unknown error")
  }

};


export const verifyForgetToken = async (tokenHash: string, db: DatabaseSync) => {
  if (!tokenHash || tokenHash.length === 0) throw new AppError("No token provided", "NO_TOKEN", 400);
  const existingToken = await forgetTokenRepository.getByTokenHash(db, tokenHash)
  if (!existingToken) throw new AppError("Invalid Token", "INVALID_TOKEN", 400)
  // TODO: optionally log or mark the ip as malicious
  const isExpired = Number(existingToken.expired_at )<= getCurrentUnixTimestamp()
  if (isExpired) throw new AppError("Invalid Token", "INVALID_TOKEN", 400)
  if (existingToken.status !== "LINK_SENT") { // means for this token, verification is already done.
    //TODO: report this incident as user is using a link which is already passed through this stage.
    throw new AppError("Invalid Token", "INVALID_TOKEN", 400)
  }
  // TODO: any other checks here?????

  // get the user details for this token
  const user = await usersRepository.getById(db, Number(existingToken.user_id))
  if (!user) throw new AppError("Invalid Token", "INVALID_TOKEN", 400)
  // TODO: send OTP to user email 
  // 
  // Once it's sent then mark the token status and code sent and add code details in db.
  try {
    db.exec(`BEGIN TRANSACTION`)
    
    db.exec("COMMIT")
  } catch (e) {
    db.exec("ROLLBACK")
    throw e instanceof Error ? e : new Error("Unknown Error");
    }

}
