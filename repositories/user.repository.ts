import { DatabaseSync } from "node:sqlite";
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
