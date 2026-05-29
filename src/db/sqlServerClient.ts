type SqlParameterValue = string | number | boolean | Date | null;

export class SqlServerClient {
  constructor(private readonly connectionString: string) {}

  async query<T>(sql: string, parameters: Record<string, SqlParameterValue> = {}): Promise<T[]> {
    const sqlServer = await import('mssql');
    const pool = await sqlServer.connect(this.connectionString);

    try {
      const request = pool.request();
      Object.entries(parameters).forEach(([name, value]) => request.input(name, value));
      const result = await request.query<T>(sql);
      return result.recordset;
    } finally {
      await pool.close();
    }
  }

  async querySingle<T>(sql: string, parameters: Record<string, SqlParameterValue> = {}): Promise<T | undefined> {
    const rows = await this.query<T>(sql, parameters);
    return rows[0];
  }

  async execute(sql: string, parameters: Record<string, SqlParameterValue> = {}): Promise<number> {
    const sqlServer = await import('mssql');
    const pool = await sqlServer.connect(this.connectionString);

    try {
      const request = pool.request();
      Object.entries(parameters).forEach(([name, value]) => request.input(name, value));
      const result = await request.query(sql);
      return result.rowsAffected.reduce((total: number, count: number) => total + count, 0);
    } finally {
      await pool.close();
    }
  }
}
