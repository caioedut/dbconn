import { Connection } from 'mysql2';

import { ConnRef } from '../../../types/database.type';

export default async function setDatabase(conn: ConnRef<Connection>, database: string) {
  await conn.current.promise().changeUser({ database });
  conn.database = database;

  return database;
}
