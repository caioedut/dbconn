import { ConnRef } from '../../types/database.type';
import connect from './connect';

export default async function setDatabase(conn: ConnRef, database: string) {
  await conn.current.destroy();

  conn.current = await connect({
    ...conn,
    database,
  });

  conn.database = database;

  return database;
}
