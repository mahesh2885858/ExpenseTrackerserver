import { DatabaseSync } from "node:sqlite";

const getTestDBInstance = () => {
  return new DatabaseSync(":memory:");
};
export default getTestDBInstance;
