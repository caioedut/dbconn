import { ConnRef } from '../../types/database.type';

export default async function getTopQuery(conn: ConnRef, table: string, count: number) {
  const query = {
    mssql: `SELECT TOP ${count} * FROM ${table}`,
    mysql: `SELECT * FROM ${table} LIMIT ${count}`,
    pg: `SELECT * FROM ${table} LIMIT ${count}`,
  }[conn.type];

  if (!query) {
    throw new Error(`Client "${conn.type}" is not supported.`);
  }

  return query;
}
