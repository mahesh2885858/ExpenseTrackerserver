import { DatabaseSync } from "node:sqlite";
import { type TRegisterBody } from "./register.schema.ts";

export async function createUser(db: DatabaseSync, body: TRegisterBody) {
  const stmt = db.prepare(`
        INSERT INTO users (username,password)
        VALUES (?,?)
        `);
  return stmt.run(body.username, body.password);
}
