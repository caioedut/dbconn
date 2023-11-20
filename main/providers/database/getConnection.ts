import { ConnRef } from '../../types/database.type';
import store from '../store';
import connect from './connect';
import connections from './connections';

export default async function getConnection(id: string): Promise<ConnRef> {
  if (!connections[id]) {
    const options = store.connections.get().find((item) => item.id === id);

    if (!options) {
      throw new Error('Connection not found');
    }

    connections[id] = {
      ...options,
      current: await connect(options),
    };
  }

  return connections[id];
}
