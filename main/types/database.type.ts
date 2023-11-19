export type ConnRef<T> = {
  connected?: boolean;
  current: T;
  database: string;
  host: string;
  id: string;
  password: string;
  port: number;
  type: 'mssql' | 'mysql' | 'pg';
  username: string;
};

export type Connect = {
  database?: string;
  host: string;
  id?: string;
  password?: string;
  port?: number;
  type: 'mssql' | 'mysql' | 'pg';
  username: string;
};
