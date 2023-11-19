import { ConnectionPool } from 'mssql';

import { ConnRef } from '../../../types/database.type';

export default async function setDatabase(conn: ConnRef<ConnectionPool>, database: string) {
  await conn.current.request().query(`USE ${database}`);

  conn.database = database;

  return database;
}
