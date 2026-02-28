import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { fileURLToPath } from "node:url";
import { runMigrations } from "./runMigrations";

export async function initDb() {
  try {
    const dirName = import.meta.dirname;
    const dbPath = path.join(dirName, "dev.db");
    const db = new DatabaseSync(dbPath);
    await runMigrations(db);
  } catch (Err) {
    console.log({ Err });
  }
}

initDb();
