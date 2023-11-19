import { Connection } from 'mysql2';

import { ConnRef } from '../../../types/database.type';

export default async function getDatabases(conn: ConnRef<Connection>) {
  const [rows] = await conn.current.promise().query<any[]>('SHOW DATABASES');

  return rows.map((row) => ({ name: row.Database }));
}
