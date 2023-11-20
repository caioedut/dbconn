import { ConnRef } from '../../types/database.type';
import query from './query';

export default async function getDatabases(conn: ConnRef) {
  const rawQuery = {
    mssql: 'SELECT name FROM sys.databases',
    mysql: 'SELECT schema_name AS name FROM information_schema.schemata',
    pg: 'SELECT datname AS name FROM pg_database',
  }[conn.type];

  const [result] = await query(conn, rawQuery);

  if ('error' in result) {
    throw result;
  }

  return result.rows;
}
