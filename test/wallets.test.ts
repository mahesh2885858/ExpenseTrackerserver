import test, { type TestContext } from "node:test";
import buildServer from "../app.ts";
import { runMigrations } from "../db/runMigrations.ts";
import getTestDBInstance from "./getTestDb.ts";
import { getValidAccessAndJwtToken, registerDummyUser } from "./utils.ts";

const db = getTestDBInstance();
const app = await buildServer({
  db,
  logger: false,
});
await runMigrations(db);
await registerDummyUser(app);
const tokens = await getValidAccessAndJwtToken(app);

test("Should get the wallets", async (t: TestContext) => {
  t.plan(1);

  const response = await app.inject({
    url: "/wallets",
    method: "get",
    headers: {
      authorization: "Bearer " + tokens.accessToken,
    },
  });
  const body = JSON.parse(response.body);
  t.assert.equal(response.statusCode, 200);
});

test("Should successfully insert wallet", async (t: TestContext) => {
  t.plan(1);

  const response = await app.inject({
    url: "/wallets",
    method: "post",
    headers: {
      authorization: "Bearer " + tokens.accessToken,
    },
    body: {
      name: "Main",
      initialBalance: 1000,
    },
  });
  const body = JSON.parse(response.body);
  t.assert.equal(response.statusCode, 200);
});

test("Should throw error if wallet body is not valid", async (t: TestContext) => {
  t.plan(1);

  const response = await app.inject({
    url: "/wallets",
    method: "post",
    headers: {
      authorization: "Bearer " + tokens.accessToken,
    },
    body: {},
  });
  t.assert.equal(response.statusCode, 500);
});
