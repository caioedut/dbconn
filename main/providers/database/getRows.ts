import { ConnRef } from '../../types/database.type';
import query from './query';

export default async function getRows(conn: ConnRef, table: string, limit = 100, offset = 0) {
  const rawQuery = {
    mssql: `SELECT * FROM ${table} ORDER BY (SELECT NULL) OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY`,
    mysql: `SELECT * FROM ${table} LIMIT ${limit} OFFSET ${offset}`,
    pg: `SELECT * FROM ${table} LIMIT ${limit} OFFSET ${offset}`,
  }[conn.type];

  const [result] = await query(conn, rawQuery);

  if ('error' in result) {
    throw result;
  }

  return result.rows;
}
