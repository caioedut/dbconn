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
    const promise = conn.current
      .raw(queryLine)
      .then((res) => {
        let rows = [];
        let fields = [];

        if (conn.type === 'mssql') {
          rows = res;

          // TODO: get column types
          if (rows.length) {
            fields = Object.keys(rows[0]).map((name) => ({ name }));
          }
        }

        if (conn.type === 'mysql') {
          rows = res[0];
          fields = res[1].map((field: MySqlField) => ({
            name: field.name,
            type: MySqlTypes[field.type as keyof typeof MySqlTypes],
          }));
        }

        if (conn.type === 'pg') {
          rows = res.rows;
          fields = res.fields.map((field: PgField) => ({
            name: field.name,
            type: PgTypes[field.dataTypeID as keyof typeof PgTypes] ?? null,
          }));
        }

        return { fields, rows };
      })
      .catch((err) => {
        const error = true;
        let code: null | string = null;
        let state: null | string = null;
        let symbol: null | string = null;
        let message: null | string = null;

        if (conn.type === 'mssql') {
          code = err.number;
          state = err.state;
          symbol = err.code;
          message = err.message;
        }

        if (conn.type === 'mysql') {
          code = err.errno;
          state = err.sqlState;
          symbol = err.code;
          message = err.message;
        }

        if (conn.type === 'pg') {
          code = err.code;
          state = err.code;
          symbol = err.severity;
          message = err.message;
        }

        return { code, error, message, state, symbol };
      });

    promises.push(promise);
  }

  return await Promise.all(promises);
}
