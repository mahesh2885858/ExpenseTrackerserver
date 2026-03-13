import test, { type TestContext } from "node:test";
import buildServer from "../app.ts";
import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import { runMigrations } from "../db/runMigrations.ts";
import getTestDBInstance from "./getTestDb.ts";

const db = getTestDBInstance();
await runMigrations(db);
const app = await buildServer({ db, logger: false });

test("register is working", async (t: TestContext) => {
  t.plan(1);
  const response = await app.inject({
    method: "GET",
    url: "/register",
  });
  t.assert.equal(response.statusCode, 404, "This should not reach ");
});

test("should throw error when the body is not present in the request", async (t: TestContext) => {
  t.plan(1);
  const response = await app.inject({
    method: "POST",
    url: "/register",
  });
  t.assert.equal(response.statusCode, 500);
});

test("should throw error when the body invalid", async (t: TestContext) => {
  t.plan(3);
  const invalidBodyOne = {
    username: "m",
    password: "1234",
  };
  const invalidBodyTwo = {
    username: "mahesh",
    password: "1234",
  };
  const responseOne = await app.inject({
    method: "POST",
    url: "/register",
    body: invalidBodyOne,
  });

  const responseTwo = await app.inject({
    method: "POST",
    url: "/register",
    body: invalidBodyTwo,
  });
  const bodyOne = JSON.parse(responseOne.body);
  const bodyTwo = JSON.parse(responseTwo.body);
  t.assert.equal(responseOne.statusCode, 400);
  t.assert.equal(bodyOne.message, "Username should be more than 3 characters");
  t.assert.equal(bodyTwo.message, "Password should be at least 8 characters");
});

test("should throw error when the username is already taken", async (t: TestContext) => {
  t.plan(3);
  const user_one = {
    username: "mahesh",
    password: "1234567890",
  };
  const user_two = {
    username: "mahesh",
    password: "asdfererd",
  };
  const user_one_created = await app.inject({
    method: "POST",
    url: "/register",
    body: user_one,
  });

  const user_two_created = await app.inject({
    method: "POST",
    url: "/register",
    body: user_two,
  });
  const bodyOne = JSON.parse(user_one_created.body);
  const bodyTwo = JSON.parse(user_two_created.body);
  t.assert.equal(user_one_created.statusCode, 200);
  t.assert.equal(user_two_created.statusCode, 400);
  t.assert.equal(bodyTwo.message, "Username is already used");
});
