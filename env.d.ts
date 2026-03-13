declare namespace NodeJS {
  interface ProcessEnv {
    DB_PROD: string;
    DB_TEST: string;
    PORT: string;
  }
}
