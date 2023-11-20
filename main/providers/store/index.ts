import Store from 'electron-store';

import { ConnRef } from '../../types/database.type';
import connections from '../database/connections';

const internal = new Store();

const store = {
  connections: {
    get() {
      const items = internal.get('connections', [
        {
          id: 'd97d2ecd-e5fe-4f34-b904-85ccdf17506a',
          name: 'Local MySQL',
          host: '127.0.0.1',
          password: '',
          port: 3306,
          type: 'mysql',
          user: 'root',
        },
      ]) as ConnRef[];

      return items.map((item) => {
        return { ...item, connected: Boolean(connections[item.id]?.current) };
      }) as ConnRef[];
    },
    set(value: ConnRef[]) {
      internal.set(
        'connections',
        (value || []).map((item) => {
          const clone: Partial<ConnRef> = structuredClone(item);
          delete clone.connected;
          delete clone.current;
          return clone;
        }),
      );
    },
  },
};

export default store;
