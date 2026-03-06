import test, { type TestContext } from "node:test";
import buildServer from "../app.ts";
import AppError from "../utils/error.ts";
import getTestDBInstance from "./getTestDb.ts";

const db = getTestDBInstance();
const app = await buildServer({ db, logger: false });

test('requesting the "/" route', async (t: TestContext) => {
  t.plan(1);
  const response = await app.inject({
    method: "GET",
    url: "/",
  });

  t.assert.strictEqual(
    response.statusCode,
    200,
    "returns a status code of 200",
  );
});

test("global App error handler", async (t: TestContext) => {
  t.plan(1);
  const app = await buildServer({ db, logger: false });
  app.get("/throw-error", async () => {
    throw new AppError("Bad username", "BAD_USERNAME", 400);
  });

  await app.ready();
  const res = await app.inject({
    method: "GET",
    url: "/throw-error",
  });
  t.assert.equal(res.statusCode, 400);
});

test("global unknown error handler", async (t: TestContext) => {
  t.plan(1);
  const app = await buildServer({ db, logger: false });
  app.get("/throw-unknown-error", async () => {
    throw new Error("Unknown error");
  });

  await app.ready();
  const res = await app.inject({
    method: "GET",
    url: "/throw-unknown-error",
  });
  t.assert.equal(res.statusCode, 500);
});

test("close the connection and should close db", async (t: TestContext) => {
  t.plan(1);
  await app.close();
  const isOpen = app.db.isOpen;
  t.assert.equal(isOpen, false, "Data base is not closed yet!!!");
});
