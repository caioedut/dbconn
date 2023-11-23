import getConnection from '../providers/database/getConnection';
import setPassword from '../providers/database/setPassword';
import store from '../providers/store';

export async function POST_password(id: string, password: string) {
  const conn = await getConnection(id, false);

  await setPassword(conn, password);

  const connections = store.connections.get();
  const model = connections.find((item) => item.id === id);

  if (model) {
    model.password = password;
    store.connections.set(connections);
  }

  return { password };
}
