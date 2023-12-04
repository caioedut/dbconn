import { ConnRef } from '../../types/database.type';
import query from './query';

export default async function getTotal(conn: ConnRef, table: string) {
  const rawQuery = `SELECT COUNT(*) AS total FROM ${table}`;

  const [result] = await query(conn, rawQuery);

  if ('error' in result) {
    throw result;
  }

  return result.rows?.[0];
}
