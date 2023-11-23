import { ConnRef } from '../../types/database.type';
import query from './query';

export default async function getColumns(conn: ConnRef, table: string) {
  const rawQuery = {
    mssql: `
      SELECT column_name AS cname, data_type AS ctype, column_default AS cdefault, is_nullable AS cnullable
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_NAME = N'${table}'
    `,
    mysql: ``,
    pg: ``,
  }[conn.type];

  const [result] = await query(conn, rawQuery);

  if ('error' in result) {
    throw result;
  }

  return result.rows.map((row: any) => ({
    name: row.cname,
    default: row.cdefault,
    nullable: row.cnullable,
    type: row.ctype,
  }));
}
