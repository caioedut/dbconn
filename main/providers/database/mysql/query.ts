import { Connection } from 'mysql2';

import { ConnRef } from '../../../types/database.type';

export default async function query(conn: ConnRef<Connection>, query: string) {
  const queries = query
    .split(';')
    .map((item) => item.trim())
    .filter(Boolean);

  const promises = [];

  for (const queryLine of queries) {
    promises.push(conn.current.promise().query(queryLine));
  }

  const result = await Promise.all(promises);

  return result.map((item) => ({
    fields: item?.[1]?.map((field) => field.name) || [],
    rows: item?.[0] || [],
  }));
}
