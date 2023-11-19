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
          port: '3306',
          type: 'mysql',
          username: 'root',
        },
      ]) as ConnRef<any>[];

      return items.map((item) => {
        return { ...item, connected: Boolean(connections[item.id]?.current) };
      }) as ConnRef<any>[];
    },
    set(value: ConnRef<any>[]) {
      internal.set(
        'connections',
        (value || []).map((item) => {
          delete item.connected;
          delete item.current;
          return item;
        }),
      );
    },
  },
};

export default store;
