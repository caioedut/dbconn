import { FieldPacket as MySqlField, Types as MySqlTypes } from 'mysql2';
import { FieldDef as PgField } from 'pg';

import { Types as PgTypes } from '../../constants/pg';
import { ConnRef } from '../../types/database.type';

export default async function query(conn: ConnRef, query?: string) {
  if (!query) {
    throw new Error(`Client "${conn.type}" is not supported.`);
  }

  const queries = query
    .split(';')
    .map((item) => item.trim())
    .filter(Boolean);

  const promises = [];

  for (const queryLine of queries) {
    const promise = conn.current.raw(queryLine).then((res) => {
      let rows = [];
      let fields = [];

      if (conn.type === 'mssql') {
        rows = res;
      }

      if (conn.type === 'mysql') {
        rows = res[0];
        fields = res[1].map((field: MySqlField) => ({
          name: field.name,
          type: MySqlTypes[field.type as keyof typeof MySqlTypes],
        }));

        // writeFileSync('database.json', JSON.stringify(res[1], null, 2), 'utf-8');
      }

      if (conn.type === 'pg') {
        rows = res.rows;
        fields = res.fields.map((field: PgField) => ({
          name: field.name,
          type: PgTypes[field.dataTypeID as keyof typeof PgTypes] ?? null,
        }));
      }

      return { fields, rows };
    });

    promises.push(
      promise,
      // .then((res) => ({
      //   fields: res?.[1]?.map((field) => field.name) || [],
      //   rows: res?.[0] || [],
      // }))
      // .catch((err) => {
      //   return {
      //     code: err.errno,
      //     error: true,
      //     message: err.message,
      //     state: err.sqlState,
      //     symbol: err.code,
      //   } satisfies QueryError;
      // }),
    );
  }

  return await Promise.all(promises);
}
