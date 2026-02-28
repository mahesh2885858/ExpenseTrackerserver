import test, { type TestContext } from "node:test";
import buildServer from "../app.ts";
import { runMigrations } from "../db/runMigrations.ts";
import getTestDBInstance from "./getTestDb.ts";

test("should properly throw error while running migrations", async (t: TestContext) => {
  t.plan(1);
  const db = getTestDBInstance();
  t.assert.rejects(runMigrations, Error);
});
