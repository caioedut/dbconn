import { ConnRef } from '../../types/database.type';

export default async function disconnect(conn: ConnRef) {
  await conn.current.destroy();
}
