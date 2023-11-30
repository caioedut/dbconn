import { ConnRef } from '../../types/database.type';
import query from './query';

export default async function getColumns(conn: ConnRef, table: string) {
  const split = table.replace(/[^\w.]/g, '').split('.');
  const tableName = split.pop();
  const tableSchema = split.pop();

  const rawQuery = {
    mssql: `
      SELECT
        COLUMN_NAME AS name,
        DATA_TYPE AS type,
        CHARACTER_MAXIMUM_LENGTH AS maxLength,
        NUMERIC_PRECISION AS numericPrecision,
        NUMERIC_SCALE AS numericScale,
        IS_NULLABLE AS nullable,
        COLUMN_DEFAULT AS defaultValue
      FROM
        INFORMATION_SCHEMA.COLUMNS
      WHERE
        TABLE_NAME = N'${tableName}'
        AND TABLE_CATALOG = N'${conn.database}'
        ${tableSchema ? `AND TABLE_SCHEMA = N'${tableSchema}'` : ''}
      ORDER BY
        ORDINAL_POSITION ASC
    `,
    mysql: `
      SELECT
        COLUMN_NAME AS name,
        DATA_TYPE AS type,
        COLUMN_KEY AS columnKey,
        CHARACTER_MAXIMUM_LENGTH AS maxLength,
        NUMERIC_PRECISION AS numericPrecision,
        NUMERIC_SCALE AS numericScale,
        IS_NULLABLE AS nullable,
        COLUMN_DEFAULT AS defaultValue
      FROM
        INFORMATION_SCHEMA.COLUMNS
      WHERE
        TABLE_NAME = N'${tableName}'
        AND TABLE_SCHEMA = N'${tableSchema || conn.database}'
      ORDER BY
        ORDINAL_POSITION ASC
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

  if (conn.type === 'mssql') {
    const [keys] = await query(
      conn,
      `
        SELECT
          C.COLUMN_NAME AS columnName,
          CONSTRAINT_TYPE AS columnKey
        FROM
          INFORMATION_SCHEMA.TABLE_CONSTRAINTS AS T
          JOIN INFORMATION_SCHEMA.CONSTRAINT_COLUMN_USAGE AS C
              ON C.CONSTRAINT_NAME = T.CONSTRAINT_NAME
        WHERE
          C.TABLE_NAME= N'${tableName}'
          AND T.TABLE_CATALOG = N'${conn.database}'
          ${tableSchema ? `AND T.TABLE_SCHEMA = N'${tableSchema}'` : ''}
      `,
    );

    if ('rows' in keys) {
      for (const column of result.rows) {
        const key = keys.rows.find((item: any) => item.columnName === column.name);
        column.columnKey = key?.columnKey === 'PRIMARY KEY' ? 'PK' : key?.columnKey === 'FOREIGN KEY' ? 'FK' : null;
      }
    }
  }

  if (conn.type === 'mysql') {
    result.rows.forEach((column: any) => {
      column.columnKey = column.columnKey === 'PRI' ? 'PK' : column.columnKey === 'MUL' ? 'FK' : null;
    });
  }

  if (conn.type === 'pg') {
    const [keys] = await query(
      conn,
      `
        SELECT
            a.attname AS columnname,
            c.contype AS columnkey
        FROM
            pg_constraint c
            INNER JOIN pg_namespace n
                ON n.oid = c.connamespace
            CROSS JOIN LATERAL UNNEST(c.conkey) AK(k)
            INNER JOIN pg_attribute a
                ON a.attrelid = c.conrelid
                AND a.attnum = ak.k
        WHERE
            c.conrelid::regclass::text = N'${tableName}'
        ORDER BY
            c.contype;
      `,
    );

    if ('rows' in keys) {
      for (const column of result.rows) {
        const key = keys.rows.find((item: any) => item.columnname === column.name);
        column.columnKey = key?.columnkey === 'p' ? 'PK' : key?.columnkey === 'f' ? 'FK' : null;
      }
    }
  }

  return result.rows;
}
