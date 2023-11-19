import { Client } from 'pg';

import { ConnRef } from '../../../types/database.type';

export default async function getTables(conn: ConnRef<Client>) {
  const { rows } = await conn.current.query(
    `SELECT table_name, table_type FROM information_schema.tables WHERE table_catalog = '${conn.database}'`,
  );

  return rows.map((row) => ({
    name: row.table_name,
    type: row.table_type?.replace(/^BASE /, '')?.toLowerCase() || null,
  }));
}
