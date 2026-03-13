import path from "node:path";
import { DatabaseSync } from "node:sqlite";
const dirname = import.meta.dirname;
const dbPath = path.join(dirname, "prod.db");
export const db = new DatabaseSync(dbPath);
