import test, { type TestContext } from "node:test";
import buildServer from "../app.ts";
import { runMigrations } from "../db/runMigrations.ts";
import getTestDBInstance from "./getTestDb.ts";
import { registerDummyUser } from "./utils.ts";

const db = getTestDBInstance();
const app = await buildServer({
  db,
  logger: false,
});
await runMigrations(db);
await registerDummyUser(app);

const responseLogin = await app.inject({
  url: "/login",
  method: "POST",
  body: {
    username: "mahesh",
    password: "12345678",
  },
});

const responseParsed = JSON.parse(responseLogin.body);
test("Should get the transactions", async (t: TestContext) => {
  t.plan(1);

  const response = await app.inject({
    url: "/transactions",
    method: "get",
    headers: {
      authorization: "Bearer " + responseParsed.accessToken,
    },
  });
  const body = JSON.parse(response.body);
  t.assert.equal(response.statusCode, 200);
});

test("Should send 500 when the wallet given was not found while adding a transaction", async (t: TestContext) => {
  t.plan(1);

  const response = await app.inject({
    url: "/transactions",
    method: "post",
    headers: {
      authorization: "Bearer " + responseParsed.accessToken,
    },
    body: {
      wallet_id: 1,
      type: "income",
      amount: 1200,
      transactionDate: 1234322,
      created_at: 1234566,
      transaction_date: 1234,
      description: "",
    },
  });
  const body = JSON.parse(response.body);
  t.assert.equal(response.statusCode, 500);
});
