import { type DatabaseSync } from "node:sqlite";
import { getCurrentUnixTimestamp } from "../utils/getCurrentUnixTimeStamp";
import { FORGET_PASSWORD_TOKEN_EXPIRY_IN_SECONDS } from "../lib/constants";

const table = "forget_password_tokens"
const getByUserId = async (db: DatabaseSync, userId: number) => {
  const stmt = db.prepare(
    `SELECT * FROM ${table}
    WHERE user_id=?`,
  );
  return stmt.get(userId);
}

const markTokenAsUsed = async (db: DatabaseSync, tokenId: number) => {
  const stmt = db.prepare(`
    UPDATE ${table} SET status=? WHERE id=?
    `)
  return stmt.run("USED", tokenId);
}

const createNewToken = async (db: DatabaseSync, tokenHash: string,userId:number) => {
  const stmt = db.prepare(`
    INSERT INTO ${table} (token_hash,created_at,user_id,status,expired_at) VALUES (?,?,?,?)
    `)
  const now = getCurrentUnixTimestamp()
  const expiry = now + FORGET_PASSWORD_TOKEN_EXPIRY_IN_SECONDS
  return stmt.run(tokenHash, now, userId, "LINK_SENT",expiry)
}

const getByTokenHash = async (db: DatabaseSync, tokenHash: string) => {
  const stmt = db.prepare(`SELECT * FROM TABLE ${table} WHERE token_hash = ?`)
  return stmt.get(tokenHash)
}
export const forgetTokenRepository = {
  getByUserId,
  markTokenAsUsed,
  createNewToken,
  getByTokenHash
}
