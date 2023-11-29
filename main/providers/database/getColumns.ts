import { ConnRef } from '../../types/database.type';
import query from './query';

export default async function getColumns(conn: ConnRef, table: string) {
  const split = table.replace(/[^\w.]/g, '').split('.');
  const tableName = split.pop();
  const tableSchema = split.pop();

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
      WHERE TABLE_NAME = N'${tableName}'
        AND TABLE_CATALOG = N'${conn.database}'
        ${tableSchema ? `AND TABLE_SCHEMA = N'${tableSchema}'` : ''}
    `,
    mysql: `
      SELECT column_name AS name,
        data_type AS type,
        character_maximum_length AS maxLength,
        numeric_precision AS numericPrecision,
        numeric_scale AS numericScale,
        is_nullable AS nullable,
        column_default AS defaultValue
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_NAME = N'${tableName}'
        AND TABLE_SCHEMA = N'${tableSchema || conn.database}'
    `,
    pg: `
      SELECT column_name AS name,
        udt_name AS type,
        character_maximum_length AS maxLength,
        numeric_precision AS numericPrecision,
        numeric_scale AS numericScale,
        is_nullable AS nullable,
        column_default AS defaultValue
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_NAME = N'${tableName}'
        AND TABLE_CATALOG = N'${conn.database}'
        AND TABLE_SCHEMA != N'pg_catalog'
        ${tableSchema ? `AND TABLE_SCHEMA = N'${tableSchema}'` : ''}
    `,
  }[conn.type];

  const [result] = await query(conn, rawQuery);

  if ('error' in result) {
    throw result;
  }

  return result.rows;
}
