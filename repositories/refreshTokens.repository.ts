import type { DatabaseSync } from "node:sqlite";
import { getCurrentUnixTimestamp } from "../utils/getCurrentUnixTimeStamp.ts";

export async function insertNewRefreshToken(
  db: DatabaseSync,
  payload: {
    token: string;
    userId: number;
    expires_at: number;
    created_at: number;
  },
) {
  const stmt = db.prepare(`
    INSERT INTO refresh_tokens (token,user_id,expires_at,created_at) VALUES (?,?,?,?)
    `);
  return stmt.run(
    payload.token,
    payload.userId,
    payload.expires_at,
    payload.created_at,
  );
}

export async function markTokenAsRevoked(token: string, db: DatabaseSync) {
  const markStmt = db.prepare(
    "UPDATE refresh_tokens SET revoked=1, revoked_at=? WHERE token=?",
  );
  return markStmt.run(getCurrentUnixTimestamp(), token);
}

export async function getExistingTokenByToken(token: string, db: DatabaseSync) {
  const getStmt = db.prepare(`SELECT * FROM refresh_tokens WHERE token=?`);
  return getStmt.get(token);
}
