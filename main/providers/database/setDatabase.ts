import { ConnRef } from '../../types/database.type';
import connect from './connect';

export default async function setDatabase(conn: ConnRef, database: string) {
  if (conn.type === 'pg') {
    await conn.current.destroy();

    conn.current = await connect({
      ...conn,
      database,
    });
  } else {
    await conn.current.raw(`USE ${database}`);
  }

  conn.database = database;

  return database;
}
