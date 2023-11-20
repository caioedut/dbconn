import { ConnectionPool } from 'mssql';

import { QueryError } from '../../../../types/database.type';
import { ConnRef } from '../../../types/database.type';

export default async function query(conn: ConnRef<ConnectionPool>, query: string) {
  const queries = query
    .split(';')
    .map((item) => item.trim())
    .filter(Boolean);

  const promises = [];

  for (const queryLine of queries) {
    promises.push(
      conn.current
        .request()
        .query(queryLine)
        .then((res) => ({
          fields: Object.keys(res.recordset.columns),
          rows: res.recordset || [],
        }))
        .catch((err) => {
          return {
            code: err.number,
            error: true,
            message: err.message,
            state: err.state,
            symbol: err.name,
          } satisfies QueryError;
        }),
    );
  }

  return await Promise.all(promises);
}
