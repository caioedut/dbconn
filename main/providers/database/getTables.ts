import { ConnRef } from '../../types/database.type';
import query from './query';

export default async function getTables(conn: ConnRef) {
  const rawQuery = {
    mssql: `SELECT table_name AS name, table_type AS type FROM information_schema.tables WHERE table_catalog = '${conn.database}'`,
    mysql: `SELECT table_name AS name, table_type AS type FROM information_schema.tables WHERE table_schema = '${conn.database}'`,
    pg: `SELECT table_name AS name, table_type AS type FROM information_schema.tables WHERE table_catalog = '${conn.database}'`,
  }[conn.type];

  const [result] = await query(conn, rawQuery);

  return result.rows.map((row: any) => ({
    name: row.name,
    type:
      row.type
        ?.replace(/^BASE /, '')
        ?.replace(/^SYSTEM /, '')
        ?.toLowerCase() || null,
  }));
}
