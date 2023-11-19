import { ConnRef } from '../../types/database.type';
import store from '../store';
import connections from './connections';

export default async function getConnection<T>(id: string): Promise<ConnRef<T>> {
  if (!connections[id]) {
    const conn = store.connections.get().find((item) => item.id === id);

    if (!conn) {
      throw new Error('Connection not found');
    }

    const connect = require(`../database/${conn.type}/connect`).default;

    connections[id] = {
      ...conn,
      current: await connect(conn),
    };
  }

  return connections[id];
}
