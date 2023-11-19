import { ConnectionPool } from 'mssql';

import { ConnRef } from '../../../types/database.type';

export default async function query(conn: ConnRef<ConnectionPool>, query: string) {
  const queries = query
    .split(';')
    .map((item) => item.trim())
    .filter(Boolean);

  const promises = [];

  for (const queryLine of queries) {
    promises.push(conn.current.request().query(queryLine));
  }

  const result = await Promise.all(promises);

  return result.map((item) => ({
    fields: Object.keys(item.recordset.columns),
    rows: item.recordset || [],
  }));
}
