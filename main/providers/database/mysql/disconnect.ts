import { Connection } from 'mysql2';

import { ConnRef } from '../../../types/database.type';

export default async function disconnect(conn: ConnRef<Connection>) {
  await conn?.current?.promise()?.end();
}
