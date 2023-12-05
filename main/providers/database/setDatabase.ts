import { ConnRef } from '../../types/database.type';
import connect from './connect';
import disconnect from './disconnect';

export default async function setDatabase(conn: ConnRef, database: string) {
  const prevDatabase = conn.database;

  try {
    await disconnect(conn);
    conn.current = await connect({ ...conn, database });
    conn.database = database;
  } catch (err) {
    if (prevDatabase) {
      conn.current = await connect({ ...conn, database: prevDatabase });
      conn.database = prevDatabase;
    }

    throw err;
  }

  return database;
}
