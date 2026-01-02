import sql from "mssql";
import type { IJokeRepository } from "../../../../application/ports/IJokeRepository";
import { Joke } from "../../../../domain/Joke";
import { Database } from "../../../config/Database";

const AUDIT_USER = "system";
const DEFAULT_TABLE = "Jokes";

const getJokesTable = (): string => {
  const table = process.env.SQL_JOKES_TABLE ?? DEFAULT_TABLE;
  if (!table) {
    throw new Error("SQL_JOKES_TABLE has invalid characters");
  }
  return table;
};

export class MssqlJokeRepository implements IJokeRepository {
  private readonly database = new Database();

  async create(text: string): Promise<Joke> {
    const pool = await this.database.getPool();
    const table = getJokesTable();
    const result = await pool
      .request()
      .input("text", sql.NVarChar(sql.MAX), text)
      .input("createdBy", sql.NVarChar(50), AUDIT_USER)
      .input("updatedBy", sql.NVarChar(50), AUDIT_USER)
      .query(
        `INSERT INTO ${table} (text, createdAt, updatedAt, createdBy, updatedBy) OUTPUT inserted.id, inserted.text VALUES (@text, GETDATE(), GETDATE(), @createdBy, @updatedBy)`
      );

    const row = result.recordset[0];
    return new Joke({ id: row.id, text: row.text });
  }

  async update(id: number, text: string): Promise<Joke | null> {
    const pool = await this.database.getPool();
    const table = getJokesTable();
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .input("text", sql.NVarChar(sql.MAX), text)
      .input("updatedBy", sql.NVarChar(50), AUDIT_USER)
      .query(
        `UPDATE ${table} SET text = @text, updatedAt = GETDATE(), updatedBy = @updatedBy OUTPUT inserted.id, inserted.text WHERE id = @id`
      );

    const row = result.recordset[0];
    return row ? new Joke({ id: row.id, text: row.text }) : null;
  }

  async delete(id: number): Promise<boolean> {
    const pool = await this.database.getPool();
    const table = getJokesTable();
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query(`DELETE FROM ${table} WHERE id = @id`);

    return result.rowsAffected[0] > 0;
  }
}
