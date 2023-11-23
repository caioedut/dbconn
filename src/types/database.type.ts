export type Result = {
  fields: {
    name: string;
    type: string;
  }[];
  rows: any[];
};

export type QueryError = {
  code: number | string;
  error: true;
  message: string;
  state: string;
  symbol: string;
};

export type Connection = {
  connected?: boolean;
  database: string;
  host: string;
  id: string;
  name?: string;
  password: string;
  port: number;
  type: 'mssql' | 'mysql' | 'pg';
  user: string;
};

export type Database = {
  name: string;
};

export type Table = {
  name: string;
  schema: string;
  type: 'function' | 'procedure' | 'table' | 'view';
};

export type Column = {
  default: unknown;
  name: string;
  nullable: boolean;
  type: string;
};
