import { ConnectionPool } from 'mssql';

import { ConnRef } from '../../../types/database.type';

export default async function getDatabases(conn: ConnRef<ConnectionPool>) {
  const result = await conn.current.request().query('SELECT name FROM sys.databases');

  return result.recordset;
}
