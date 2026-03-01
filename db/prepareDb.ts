import { db } from "./createDb.ts";
import { runMigrations } from "./runMigrations.ts";

const prepareDB = async () => {
  await runMigrations(db);
};

prepareDB();
