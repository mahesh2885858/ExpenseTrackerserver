import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import { readdir, readFile } from "node:fs/promises";
import AppError from "../utils/error.ts";
import { createHash } from "node:crypto";

const createMigrationIfNotExistIndb = async (db: DatabaseSync) => {
  const createDBStmt = db.prepare(`
    CREATE TABLE IF NOT EXISTS migrations(
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    checksum TEXT NOT NULL,
    applied_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    `);

  createDBStmt.run();
};

const runMigrationFiles = async (
  filesInTheDir: string[],
  directoryWhichHasMigrations: string,
  db: DatabaseSync,
) => {
  for (const file of filesInTheDir) {
    try {
      const filePath = path.join(directoryWhichHasMigrations, file);
      const sql = await readFile(filePath, "utf-8");
      if (sql.trim().length === 0)
        throw new Error("Invalid sql from file: " + filePath);

      const normalizedSql = sql.replace(/\r\n/g, "\n");
      const hash = createHash("sha256");
      hash.update(normalizedSql, "utf-8");
      const checksum = hash.digest("hex");
      db.exec("BEGIN;");
      db.exec(sql);
      const prepareStmt = db.prepare(`
            INSERT INTO migrations (name,checksum) VALUES (?,?);
            `);
      prepareStmt.run(file, checksum);
      db.exec("COMMIT;");
    } catch (err) {
      if (db.isTransaction) {
        db.exec("ROLLBACK;");
      }
      throw err;
    }
  }
};

export async function runMigrations(db: DatabaseSync) {
  try {
    await createMigrationIfNotExistIndb(db);

    // get the directory which contains migration files
    const directoryWhichHasMigrations = path.join(
      import.meta.dirname,
      "migrations",
    );

    const filesInTheDir = await readdir(directoryWhichHasMigrations);

    if (filesInTheDir.length === 0) {
      throw new Error(
        "No migration files found in the folder: " +
          directoryWhichHasMigrations,
      );
    }

    const uniqueFiles = new Set(filesInTheDir);
    if (filesInTheDir.length !== uniqueFiles.size) {
      throw new Error(
        "Same name was found. Migration files should have unique names",
      );
    }

    //  TODO: we need a way to check file names before ordering them.
    // filesInTheDir.forEach((file) => {
    //   // get the first three characters of filename
    //   const firstThreeChars = file.slice(0, 3)

    // })

    // sort the files (old sql files first and new sql files should come last)
    filesInTheDir.sort();

    // get the migration names from migrations table
    const appliedMigrationsStmt = db.prepare(`
      SELECT  *  FROM migrations ORDER BY name;
      `);

    const appliedMigrations = appliedMigrationsStmt.all();

    if (appliedMigrations.length === 0) {
      await runMigrationFiles(filesInTheDir, directoryWhichHasMigrations, db);
      console.log("Migration completed!!!");
    } else {
      const appliedSet = new Set(appliedMigrations.map((i) => i.name));

      // Make sure no migration file is deleted from folder which has already ran. and checksum is verified
      for (const migration of appliedMigrations) {
        const isDeleted =
          filesInTheDir.findIndex((file) => file === migration.name) === -1;

        if (isDeleted)
          throw new Error(
            `Applied migration ${migration.name} is missing from local migration directory. Migration history must be immutable. Please restore the file or reset the database.`,
          );

        const sql = await readFile(
          path.join(directoryWhichHasMigrations, String(migration.name)),
          "utf-8",
        );
        const normalizedSql = sql.replace(/\r\n/g, "\n");

        const hash = createHash("sha256");

        hash.update(normalizedSql, "utf-8");
        const checksumLocal = hash.digest("hex");
        const checkSumDb = migration.checksum;
        const isCheckSumVerified = checkSumDb === checksumLocal;
        if (!isCheckSumVerified) {
          throw new Error(
            "Migration checksum mismatch detected for the file " +
              migration.name +
              ". Please revert the file to it's original state or reset the database.",
          );
        }
      }

      // find the first element which is not run yet
      const t = filesInTheDir.findIndex((file) => !appliedSet.has(file));

      if (t === -1) {
        console.log("Nothing to run!!!!!");
        return;
      }

      const remainingMigrationsToRun = filesInTheDir.slice(t, undefined);

      // make sure the remaining migrations are never ran,
      remainingMigrationsToRun.forEach((m) => {
        if (appliedSet.has(m)) {
          throw new Error(
            `The migrations file ${m}, should not have ran. May be there is a gap in the migrations order please manually check this to ensure your previous migration ran properly.`,
          );
        }
      });

      await runMigrationFiles(
        remainingMigrationsToRun,
        directoryWhichHasMigrations,
        db,
      );

      console.log("Migration completed!!!");
    }
  } catch (e: any) {
    throw new AppError(e.message, "ERR_MIGRATION", 500);
  }
}
