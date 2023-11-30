export type Result = {
  affectedRows: null | number;
  fields: Column[];
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
  fullName: string;
  name: string;
  schema: string;
  type: 'function' | 'procedure' | 'table' | 'view';
};

export type Column = {
  columnKey: 'FK' | 'PK' | null;
  defaultValue: unknown;
  maxLength: null | number;
  name: string;
  nullable: 'NO' | 'YES';
  numericPrecision: null | number;
  numericScale: null | number;
  type: string;
};
