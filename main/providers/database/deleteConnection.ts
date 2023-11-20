import store from '../store';
import connections from './connections';
import disconnect from './disconnect';

export default async function deleteConnection(id: string) {
  const conn = store.connections.get().find((item) => item.id === id);

  if (conn) {
    await disconnect(conn);
    delete connections[id];
  }
}
