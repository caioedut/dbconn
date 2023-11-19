import { Connection } from 'mysql2';

import { ConnRef } from '../../../types/database.type';

export default async function getTables(conn: ConnRef<Connection>) {
  const [rows] = await conn.current.promise().query<any[]>(`SHOW FULL TABLES IN ${conn.database}`);

  return rows.map((row) => ({
    name: row[Object.keys(row)[0]],
    type: row.Table_type?.replace(/^BASE /, '')?.toLowerCase() || null,
  }));
}
