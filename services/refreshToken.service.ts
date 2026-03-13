import { type DatabaseSync } from "node:sqlite";
import AppError from "../utils/error.ts";
import { getCurrentUnixTimestamp } from "../utils/getCurrentUnixTimeStamp.ts";
import {
  getExistingTokenByToken,
  insertNewRefreshToken,
  markTokenAsRevoked,
} from "../repositories/refreshTokens.repository.ts";
import { generateRefreshToken } from "../utils/generateRefreshToken.ts";
import type Jwt from "../lib/jwt.ts";
import { REFRESH_TOKEN_EXPIRY_IN_SECONDS } from "../lib/constants.ts";

export const issueRefreshToken = async (
  oldToken: string,
  jwt: Jwt,
  db: DatabaseSync,
) => {
  // check for the existence of old token in the database
  const existing = await getExistingTokenByToken(oldToken, db);
  const now = getCurrentUnixTimestamp();

  if (!existing) {
    // TODO: we should report this as malicious activity
    throw new AppError("Invalid Token", "INVALID_TOKEN", 401);
  }

  if (existing.revoked === 1) {
    // TODO: user tried to generate new token using an revoked token report this as malicious
    throw new AppError("Invalid Token", "INVALID_TOKEN", 401);
  }

  if (now > (existing.expires_at as number)) {
    // token expired need to login again
    throw new AppError("Token expired", "TOKEN_EXPIRED", 401);
  }

  // mark this token as revoked
  await markTokenAsRevoked(existing.token as string, db);

  const newRefreshToken = generateRefreshToken();

  // save this token to db
  await insertNewRefreshToken(db, {
    created_at: now,
    expires_at: now + REFRESH_TOKEN_EXPIRY_IN_SECONDS,
    token: newRefreshToken,
    userId: existing.user_id as number,
  });

  const accessToken = jwt.encode({
    sub: existing.user_id as number,
    iat: now,
  });

  return {
    accessToken,
    refreshToken: newRefreshToken,
  };
};
