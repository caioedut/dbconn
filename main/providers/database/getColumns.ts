import { ConnRef } from '../../types/database.type';
import query from './query';

export default async function getColumns(conn: ConnRef, table: string) {
  const rawQuery = {
    mssql: `
      SELECT column_name AS name,
        data_type AS type,
        character_maximum_length AS maxLength,
        numeric_precision AS numericPrecision,
        numeric_scale AS numericScale,
        is_nullable AS nullable,
        column_default AS defaultValue
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

  return result.rows;
}
