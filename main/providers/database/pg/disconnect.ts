import { Connection } from 'pg';

import { ConnRef } from '../../../types/database.type';

export default async function disconnect(conn: ConnRef<Connection>) {
  await conn?.current?.end();
}
