import sql from "mssql";

export class Database {
  private pool: sql.ConnectionPool | null = null;

  async getPool(): Promise<sql.ConnectionPool> {
    if (this.pool) {
      return this.pool;
    }
    const connectionString = process.env.MSSQL_CONNECTION_STRING;
    if (!connectionString) {
      throw new Error("MSSQL_CONNECTION_STRING is not set");
    }
    this.pool = await sql.connect(connectionString);
    return this.pool;
  }
}
