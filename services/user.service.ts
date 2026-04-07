import { DatabaseSync } from "node:sqlite";
import {
  MAX_NAME_LENGTH,
  MIN_NAME_LENGTH
} from "../lib/constants.ts";
import { usersRepository } from "../repositories/user.repository.ts";
import type { TUserUpdateBody } from "../schemas/users.schema.ts";
import AppError from "../utils/error.ts";

const updateUser = async (
  user_id: number,
  body: TUserUpdateBody,
  db: DatabaseSync,
) => {
  // Ignore all other properties sent
  const allowedBody = {
    email: body.email,
    name: body.name,
  };
  if (allowedBody.email === undefined && !allowedBody.name?.trim()) {
    throw new AppError("No body Provided for updating", "NO_BODY", 400);
  }
  if (allowedBody.name) {
    if (allowedBody.name.trim().length < MIN_NAME_LENGTH) {
      throw new AppError(
        "Minimum " +
          MIN_NAME_LENGTH +
          " characters needed for user's name",
        "TOO_LONG",
        400,
      );
    }
    if (allowedBody.name?.trim().length > MAX_NAME_LENGTH) {
      throw new AppError(
        "Maximum " +
          MAX_NAME_LENGTH +
          " characters allowed for user's name",
        "TOO_LONG",
        400,
      );
    }
  }

  const exist = usersRepository.getById(db, user_id);

  if (!exist) {
    throw new AppError(
      "No user found",
      "USER_NOT_FOUND",
      400,
    );
  }

  return usersRepository.patch(db, user_id, allowedBody);
};

const getUser = async (user_id: number, db: DatabaseSync) => {
  const exist =await usersRepository.getById(db, user_id);
  if (!exist) {
    throw new AppError(
      "No user found",
      "USER_NOT_FOUND",
      400,
    );
  }
  return {
    name: exist.name ?? "",
    email:exist.email??""
  }
}

export const userService = {
  patch: updateUser,
  get:getUser
};
