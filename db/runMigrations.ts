import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import { readFile } from "node:fs/promises";
import AppError from "../utils/error.ts";

export async function runMigrations(db: DatabaseSync) {
  try {
    const migrationFilePath = path.join(
      import.meta.dirname,
      "schemas",
      "init.sql",
    );
    const sql = await readFile(migrationFilePath, "utf-8");
    db.exec(sql);
    console.log("Migration completed!!!");
  } catch (e: any) {
    throw new AppError(e.message, "ERR_MIGRATION", 500);
  }
}
