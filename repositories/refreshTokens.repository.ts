import type { DatabaseSync } from "node:sqlite";

export async function insertNewRefreshToken(
  db: DatabaseSync,
  payload: { token: string; userId: number },
) {
  const stmt = db.prepare(`
    INSERT INTO refresh_tokens (token,user_id) VALUES (?,?)
    `);
  return stmt.run(payload.token, payload.userId);
}
