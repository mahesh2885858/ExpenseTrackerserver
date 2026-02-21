import { DatabaseSync } from "node:sqlite";
import bcrypt from "bcrypt";
import AppError from "../../utils/error.ts";
import { type TRegisterBody } from "./register.schema.ts";
import { createUser } from "./register.queries.ts";

export async function register_user(db: DatabaseSync, data: TRegisterBody) {
  const username = data.username;
  const password = data.password;

  if (username.trim().length <= 3) {
    throw new AppError(
      "Username should be more than 3 characters",
      "SHORT_USERNAME",
      400,
    );
  }

  if (password.trim().length < 8) {
    throw new AppError(
      "Password should be at least 8 characters",
      "PASSWORD_TOO_SHORT",
      400,
    );
  }

  // check db for existing username
  const checkStmt = db.prepare("SELECT 1 FROM users WHERE username = ?");
  const exists = checkStmt.get(username);
  if (exists) {
    throw new AppError("Username is already used", "USER_EXIST", 400);
  }

  // we are good to go
  const saltRounds = 5;
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(password, salt);

  await createUser(db, {
    password: hash,
    username,
  });

  return { success: true };
}
