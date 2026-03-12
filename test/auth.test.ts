import test, { type TestContext } from "node:test";
import buildServer from "../app.ts";
import { runMigrations } from "../db/runMigrations.ts";
import getTestDBInstance from "./getTestDb.ts";

const db = getTestDBInstance();
const app = await buildServer({
  db,
  logger: false,
});
await runMigrations(db);
const invalidJwt =
  "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJtYWhlc2giLCJleHAiOiIxNzczMzAzNjI4In0.2JXrlfFQGcHORSpK4YkH6RTHEC-I7hZYK-t5FdbwQqM";
const expiredJWT =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjEsImV4cCI6MTc3MzMwMzYyOH0.sEgIivrTqaiydsIyaDauKgyi46vF3y0nsPY2WUyez7Y";
test("Should throw error if no token was found in headers", async (t: TestContext) => {
  t.plan(2);

  const response = await app.inject({
    url: "/transactions",
    method: "get",
  });
  const body = JSON.parse(response.body);
  t.assert.equal(body.message, "User not authenticated");
  t.assert.equal(response.statusCode, 401);
});

test("Should throw error if token is missing authScheme", async (t: TestContext) => {
  t.plan(2);

  const response = await app.inject({
    url: "/transactions",
    method: "get",
    headers: {
      authorization: "some random token",
    },
  });
  const body = JSON.parse(response.body);
  t.assert.equal(body.message, "Invalid authentication scheme.");
  t.assert.equal(response.statusCode, 401);
});

test("Should throw error if the token is invalid", async (t: TestContext) => {
  t.plan(2);

  const response = await app.inject({
    url: "/transactions",
    method: "get",
    headers: {
      authorization: "Bearer  ",
    },
  });
  const body = JSON.parse(response.body);
  t.assert.equal(body.message, "Invalid token");
  t.assert.equal(response.statusCode, 401);
});

test("Should throw error if the token provided is not a jwt", async (t: TestContext) => {
  t.plan(2);

  const response = await app.inject({
    url: "/transactions",
    method: "get",
    headers: {
      authorization: "Bearer  123456#456 ",
    },
  });
  const body = JSON.parse(response.body);
  t.assert.equal(body.message, "Invalid token");
  t.assert.equal(response.statusCode, 401);
});

test("Should throw error if the token provided is not a valid jwt", async (t: TestContext) => {
  t.plan(2);

  const response = await app.inject({
    url: "/transactions",
    method: "get",
    headers: {
      authorization: "Bearer " + invalidJwt,
    },
  });
  const body = JSON.parse(response.body);
  t.assert.equal(body.message, "User not authenticated");
  t.assert.equal(response.statusCode, 401);
});

test("Should throw error if the token provided is expired", async (t: TestContext) => {
  t.plan(2);

  const response = await app.inject({
    url: "/transactions",
    method: "get",
    headers: {
      authorization: "Bearer " + expiredJWT,
    },
  });
  const body = JSON.parse(response.body);
  t.assert.equal(body.message, "Token Expired");
  t.assert.equal(response.statusCode, 401);
});
