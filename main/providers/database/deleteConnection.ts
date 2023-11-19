import store from '../store';
import connections from './connections';

export default async function deleteConnection(id: string) {
  const conn = store.connections.get().find((item) => item.id === id);

  if (conn) {
    const disconnect = require(`../database/${conn.type}/disconnect`).default;

    await disconnect(conn);

    delete connections[id];
  }
}
