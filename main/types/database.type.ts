import { Knex } from 'knex';

export type ConnRef = {
  connected?: boolean;
  current: Knex;
  database: string;
  host: string;
  id: string;
  password: string;
  port: number;
  type: 'mssql' | 'mysql' | 'pg';
  user: string;
};

export type Connect = {
  database?: string;
  host: string;
  id?: string;
  password?: string;
  port?: number;
  type: 'mssql' | 'mysql' | 'pg';
  user: string;
};
