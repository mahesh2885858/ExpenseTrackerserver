import {
  MAX_USERNAME_LENGTH,
  MIN_USERNAME_LENGTH,
  REFRESH_TOKEN_EXPIRY_IN_SECONDS,
} from "../lib/constants.ts";
import AppError from "../utils/error.ts";
import type { TLoginBody } from "../schemas/login.schema.ts";
import { getUserByUsername } from "../repositories/user.repository.ts";
import { DatabaseSync } from "node:sqlite";
import bcrypt from "bcrypt";
import type Jwt from "../lib/jwt.ts";
import { randomUUID } from "node:crypto";
import { insertNewRefreshToken } from "../repositories/refreshTokens.repository.ts";
import { getCurrentUnixTimestamp } from "../utils/getCurrentUnixTimeStamp.ts";

async function LoginService(body: TLoginBody, db: DatabaseSync, jwt: Jwt) {
  if (body.username?.length < MIN_USERNAME_LENGTH) {
    throw new AppError(
      `Username should be minimum ${MIN_USERNAME_LENGTH} characters`,
      "USERNAME_TO0_SHORT",
      400,
    );
  }
  if (body.username?.length > MAX_USERNAME_LENGTH) {
    throw new AppError(
      `Username should not be more than ${MAX_USERNAME_LENGTH} characters`,
      "USERNAME_TO0_LONG",
      400,
    );
  }

  const existingUser = await getUserByUsername(db, body.username);
  if (!existingUser) {
    throw new AppError("No user found with the given username", "NO_USER", 400);
  }

  // compare the passwords here
  const actualPassword = existingUser.password;
  const match = await bcrypt.compare(body.password, actualPassword as string);
  if (match) {
    const token = jwt.encode({
      sub: existingUser.id as number,
      iat: getCurrentUnixTimestamp(),
    });

    const refreshToken = randomUUID();
    await insertNewRefreshToken(db, {
      token: refreshToken,
      userId: existingUser.id as number,
      expires_at: getCurrentUnixTimestamp() + REFRESH_TOKEN_EXPIRY_IN_SECONDS,
      created_at: getCurrentUnixTimestamp(),
    });

    return {
      refreshToken,
      accessToken: token,
      username: existingUser.username,
      id: existingUser.id,
    };
  } else {
    throw new AppError("Password is incorrect", "INCORRECT_PASSWORD", 400);
  }
}

export default LoginService;
