import { orderBy } from '../../helpers/array.helper';
import { ConnRef } from '../../types/database.type';
import query from './query';

export default async function getTables(conn: ConnRef) {
  const rawQuery = {
    mssql: `SELECT table_name AS tbname, table_type AS tbtype, table_schema AS tbschema FROM information_schema.tables WHERE table_catalog = '${conn.database}'`,
    mysql: `SELECT table_name AS tbname, table_type AS tbtype FROM information_schema.tables WHERE table_schema = '${conn.database}'`,
    pg: `SELECT table_name AS tbname, table_type AS tbtype, table_schema AS tbschema FROM information_schema.tables WHERE table_catalog = '${conn.database}' AND table_schema NOT IN ('pg_catalog', 'information_schema')`,
  }[conn.type];

  const [result] = await query(conn, rawQuery);

  if ('error' in result) {
    throw result;
  }

  return orderBy(
    result.rows.map((row: any) => ({
      name: row.tbname,
      schema: row.tbschema ?? null,
      type:
        row.tbtype
          ?.replace(/^BASE /, '')
          ?.replace(/^SYSTEM /, '')
          ?.toLowerCase() || null,
    })),
    ['schema', 'name'],
  );
}
