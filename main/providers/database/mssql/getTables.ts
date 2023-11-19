import { ConnectionPool } from 'mssql';

import { ConnRef } from '../../../types/database.type';

export default async function getTables(conn: ConnRef<ConnectionPool>) {
  const result = await conn.current
    .request()
    .query(`SELECT table_name, table_type FROM information_schema.tables WHERE table_catalog = '${conn.database}'`);

  return result.recordset.map((row) => ({
    name: row.table_name,
    type: row.table_type?.replace(/^BASE /, '')?.toLowerCase() || null,
  }));
}
