import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";

export async function initDb() {
  try {
    console.log("mahesh");
    const db = new DatabaseSync("./dev.db");
    const filePath = resolve("schemas/init.sql");
    const sql = await readFile(filePath, "utf-8");
    console.log({ sql });
    db.exec(sql);
    console.log("Database is ready");
  } catch (Err) {
    console.log({ Err });
  }
}

initDb();
