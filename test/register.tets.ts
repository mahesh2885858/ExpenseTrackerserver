import test, { type TestContext } from "node:test";
import buildServer from "../app.ts";
const app = await buildServer({ db: ":memory:" });
test("register is working", async (t: TestContext) => {
  t.plan(1);
  const response = await app.inject({
    method: "GET",
    url: "/register",
  });
  t.assert.equal(response.statusCode, 404, "This should not reach ");
});
