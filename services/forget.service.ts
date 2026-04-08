import { type DatabaseSync } from "node:sqlite";
import { usersRepository } from "../repositories/user.repository.ts";
import AppError from "../utils/error.ts";

export const issueForgetToken = async (
  email: string,
  db: DatabaseSync,
) => {
  const emailExist =await usersRepository.getByEmail(db,email)
  if (!emailExist) throw new AppError("No record found with the given email", "NOT_FOUND", 400,)
// successful response look like this:
// {
  //   id: 1,
  //   username: 'mahesh',
  //   password: '$2b$05$YpoFcWEtZkelKqwe2354swew/;bpfWGXse2sqiKWd79DR/7eoIiimUwfSbUxswaqO',
  //   name: 'mahesh',
  //   email: 'mahesh2885858@gmail.com'
  // }
  // To-do: implement rest of the feature
};
