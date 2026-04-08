import { DatabaseSync, type SQLInputValue } from "node:sqlite";
import { type TRegisterBody } from "../schemas/register.schema.ts";

export async function createUser(db: DatabaseSync, body: TRegisterBody) {
  const stmt = db.prepare(`
        INSERT INTO users (username,password)
        VALUES (?,?)
        `);
  return stmt.run(body.username, body.password);
}

export async function getUserByUsername(db: DatabaseSync, username: string) {
  const stmt = db.prepare(`
    SELECT * FROM users WHERE username = ?
    `);
  return stmt.get(username);
}

export async function getByUserId(db: DatabaseSync, userId: number) {
  const stmt = db.prepare(`
    SELECT * FROM users WHERE id = ?
    `);
  return stmt.get(userId);
}

export async function getUserByEmail(db: DatabaseSync, email: string) {
  const stmt = db.prepare(`SELECT * FROM users WHERE email = ?`)
  return stmt.get(email)
}

const updateUserById = (db: DatabaseSync, id: number, body: Partial<{}>) => {
  const fields = [];
  const values: SQLInputValue[] = [];
  for (const [key, value] of Object.entries(body)) {
    fields.push(`${key} = ?`);
    values.push(value as string | number);
  }
  values.push(id);
  const sql = `UPDATE users SET ${fields.join(", ")} WHERE id=? RETURNING *`;
  const updateStmt = db.prepare(sql);
  return updateStmt.get(...values);
};

export const usersRepository = {
  create: createUser,
  getByUsername: getUserByUsername,
  getById: getByUserId,
  patch: updateUserById,
  getByEmail:getUserByEmail
};
