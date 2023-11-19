import { ConnectionPool } from 'mssql';

import { ConnRef } from '../../../types/database.type';

export default async function disconnect(conn: ConnRef<ConnectionPool>) {
  await conn.current.close();
}
