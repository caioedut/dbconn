export type Connection = {
  connected?: boolean;
  database: string;
  host: string;
  id: string;
  name?: string;
  password: string;
  port: number;
  type: 'mssql' | 'mysql' | 'pg';
  username: string;
};

export type Database = {
  name: string;
};

export type Table = {
  name: string;
  type: 'function' | 'procedure' | 'table' | 'view';
};

export type Result = {
  fields: string[];
  rows: any[];
};

export type QueryError = {
  code: number;
  error: true;
  message: string;
  state: string;
  symbol: string;
};
