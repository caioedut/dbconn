import connections from './connections';
import disconnect from './disconnect';

export default async function deleteConnection(id: string) {
  const conn = connections[id];

  if (conn) {
    await disconnect(conn);
    delete connections[id];
  }
}
