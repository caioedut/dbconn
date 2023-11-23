import { ConnRef } from '../../types/database.type';

export default async function getRows(conn: ConnRef, table: string) {
  const result = await conn.current.select().from(table).limit(100);

  return result;
}
