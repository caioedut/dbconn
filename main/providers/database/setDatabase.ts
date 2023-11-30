import { ConnRef } from '../../types/database.type';
import connect from './connect';
import disconnect from './disconnect';

export default async function setDatabase(conn: ConnRef, database: string) {
  await disconnect(conn);

  conn.current = await connect({
    ...conn,
    database,
  });

  conn.database = database;

  return database;
}
