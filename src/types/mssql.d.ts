declare module 'mssql' {
  export interface QueryResult<T> {
    recordset: T[];
    rowsAffected: number[];
  }

  export interface Request {
    input(name: string, value: unknown): Request;
    query<T = unknown>(sql: string): Promise<QueryResult<T>>;
  }

  export interface ConnectionPool {
    request(): Request;
    close(): Promise<void>;
  }

  export function connect(connectionString: string): Promise<ConnectionPool>;
}
