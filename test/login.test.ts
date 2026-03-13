import test, { type TestContext } from "node:test";
import getTestDBInstance from "./getTestDb.ts";
import buildServer from "../app.ts";
import { runMigrations } from "../db/runMigrations.ts";
import { MAX_USERNAME_LENGTH, MIN_USERNAME_LENGTH } from "../lib/constants.ts";

const db = getTestDBInstance();
const app = await buildServer({
  db,
  logger: false,
});
await runMigrations(db);
test("Should throw error if username not found", async (t: TestContext) => {
  t.plan(2);
  const invalidUsername = {
    username: "testInvalid",
    password: "password",
  };
  const response = await app.inject({
    url: "/login",
    method: "POST",
    body: invalidUsername,
  });
  const body = JSON.parse(response.body);
  t.assert.equal(body.message, "No user found with the given username");
  t.assert.equal(response.statusCode, 400);
});

test("Should throw error if username too short", async (t: TestContext) => {
  t.plan(2);
  const shortUsername = {
    username: "test",
    password: "password",
  };
  const response = await app.inject({
    url: "/login",
    method: "POST",
    body: shortUsername,
  });
  const body = JSON.parse(response.body);
  t.assert.equal(
    body.message,
    `Username should be minimum ${MIN_USERNAME_LENGTH} characters`,
  );
  t.assert.equal(response.statusCode, 400);
});

test("Should throw error if username too long", async (t: TestContext) => {
  t.plan(2);
  const longUsername = {
    username: "testWithLongUsernameMaximumallowedISTwentyChars",
    password: "password",
  };
  const response = await app.inject({
    url: "/login",
    method: "POST",
    body: longUsername,
  });
  const body = JSON.parse(response.body);
  t.assert.equal(
    body.message,
    `Username should not be more than ${MAX_USERNAME_LENGTH} characters`,
  );
  t.assert.equal(response.statusCode, 400);
});

test("Should throw if the given password is wrong", async (t: TestContext) => {
  t.plan(2);
  // first insert a User
  await app.inject({
    method: "POST",
    url: "/register",
    body: {
      username: "mahesh",
      password: "12345678",
    },
  });
  // give wrong password and login
  const response = await app.inject({
    url: "/login",
    method: "POST",
    body: {
      username: "mahesh",
      password: "1234",
    },
  });
  const responseBody = JSON.parse(response.body);
  t.assert.equal(response.statusCode, 400);
  t.assert.equal(responseBody.message, "Password is incorrect");
});

test("Should login user if password is correct", async (t: TestContext) => {
  t.plan(1);
  // first insert a User
  await app.inject({
    method: "POST",
    url: "/register",
    body: {
      username: "maheshOne",
      password: "12345678",
    },
  });
  // give wrong password and login
  const response = await app.inject({
    url: "/login",
    method: "POST",
    body: {
      username: "maheshOne",
      password: "12345678",
    },
  });
  const responseBody = JSON.parse(response.body);
  t.assert.equal(response.statusCode, 200);
});
