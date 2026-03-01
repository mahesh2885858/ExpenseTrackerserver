import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import { readdir, readFile } from "node:fs/promises";
import AppError from "../utils/error.ts";

export async function runMigrations(db: DatabaseSync) {
  try {
    // get the directory which contains migration files
    const directoryWhichHasMigrations = path.join(
      import.meta.dirname,
      "migrations",
    );
    console.log({
      directoryWhichHasMigrations,
    });

    const filesInTheDir = await readdir(directoryWhichHasMigrations);
    console.log({
      filesInTheDir,
    });
    if (filesInTheDir.length === 0) {
      throw new Error(
        "No migration files found in the folder: " +
          directoryWhichHasMigrations,
      );
    }

    //  TODO: we need a way to check file names before ordering them.
    // filesInTheDir.forEach((file) => {
    //   // get the first three characters of filename
    //   const firstThreeChars = file.slice(0, 3)

    // })

    // sort the files (old sql files first and new sql files should come last)
    filesInTheDir.sort();

    console.log({ sortedFiles: filesInTheDir });

    const statementsToExec = [];
    for (const file of filesInTheDir) {
      const filePath = path.join(directoryWhichHasMigrations, file);
      const sql = await readFile(filePath, "utf-8");
      if (sql.trim().length === 0)
        throw new Error("Invalid sql from file: " + filePath);
      statementsToExec.push(sql);
    }

    console.log({ statementsToExec });
    if (statementsToExec.length === 0) {
      console.log("Nothing to run!!");
    } else {
      for (const sql of statementsToExec) {
        db.exec(sql);
      }
    }
    // const sql = await readFile(migrationFilePath, "utf-8");
    // db.exec(sql);
    console.log("Migration completed!!!");
  } catch (e: any) {
    throw new AppError(e.message, "ERR_MIGRATION", 500);
  }
}
