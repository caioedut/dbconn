import { Connection } from 'mysql2';

import { ConnRef } from '../../../types/database.type';

export default async function query(conn: ConnRef<Connection>, query: string) {
  const queries = query
    .split(';')
    .map((item) => item.trim())
    .filter(Boolean);

  const promises = [];

  for (const queryLine of queries) {
    promises.push(
      conn.current
        .promise()
        .query(queryLine)
        .then((res) => ({
          fields: res?.[1]?.map((field) => field.name) || [],
          rows: res?.[0] || [],
        }))
        .catch((err) => ({
          code: err.errno,
          error: true,
          message: err.message,
          state: err.sqlState,
          symbol: err.code,
        })),
    );
  }

  return await Promise.all(promises);
}
