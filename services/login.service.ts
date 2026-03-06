import { MAX_USERNAME_LENGTH, MIN_USERNAME_LENGTH } from "../lib/constants.ts";
import AppError from "../utils/error.ts";
import type { TLoginBody } from "../schemas/login.schema.ts";
import { getUserByUsername } from "../repositories/user.repository.ts";
import { DatabaseSync } from "node:sqlite";
import bcrypt from "bcrypt";

async function LoginService(body: TLoginBody, db: DatabaseSync) {
  if (body.username?.length < MIN_USERNAME_LENGTH) {
    throw new AppError(
      `Username should be minimum ${MIN_USERNAME_LENGTH} characters`,
      "USERNAME_TO_SHORT",
      400,
    );
  }
  if (body.username?.length > MAX_USERNAME_LENGTH) {
    throw new AppError(
      `Username should not be more than ${MIN_USERNAME_LENGTH} characters`,
      "USERNAME_TO_SHORT",
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
    return existingUser;
  } else {
    throw new AppError("Password is incorrect", "INCORRECT_PASSWORD", 400);
  }
}

export default LoginService;
