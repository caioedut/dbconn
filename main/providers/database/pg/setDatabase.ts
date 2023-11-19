import { Client } from 'pg';

import { ConnRef } from '../../../types/database.type';
import connect from './connect';

export default async function setDatabase(conn: ConnRef<Client>, database: string) {
  await conn.current.end();

  conn.current = await connect({
    ...conn,
    database,
  });

  return database;
}
