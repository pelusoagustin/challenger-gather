import "dotenv/config";
import fs from "node:fs/promises";
import path from "node:path";
import sql from "mssql";
const SQL_FILE = path.resolve("sql/init.sql");

const run = async (): Promise<void> => {
  const connectionString = process.env.MSSQL_CONNECTION_STRING;
  if (!connectionString) {
    throw new Error("MSSQL_CONNECTION_STRING is not set");
  }

  const script = (await fs.readFile(SQL_FILE, "utf8")).trim();
  if (!script) {
    throw new Error("SQL file is empty");
  }

  const pool = await sql.connect(connectionString);
  try {
    await pool.request().batch(script);
  } finally {
    await pool.close();
  }
};

run().catch((error) => {
  console.error("Failed to execute SQL script", error);
  process.exitCode = 1;
});
