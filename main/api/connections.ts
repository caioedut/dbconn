import { v4 as uuid } from 'uuid';

import deleteConnection from '../providers/database/deleteConnection';
import getConnection from '../providers/database/getConnection';
import getDatabases from '../providers/database/getDatabases';
import setDatabase from '../providers/database/setDatabase';
import store from '../providers/store';
import { ConnRef } from '../types/database.type';

export async function GET_index() {
  return store.connections.get();
}

export async function POST_index(data: ConnRef) {
  const connections = store.connections.get();

  let id = data.id;
  let model: ConnRef | undefined;

  if (!id) {
    id = uuid();
    model = { id } as ConnRef;
    connections.push(model);
  } else {
    model = connections.find((item) => item.id === id);
  }

  if (model) {
    Object.assign(model, { ...data, id });
  }

  store.connections.set(connections);

  return model;
}

export async function DELETE_index(id: string) {
  const connections = store.connections.get();
  store.connections.set(connections.filter((item) => item.id != id));
}

export async function POST_connect(id: string) {
  await getConnection(id);

  return { connected: true };
}

export async function POST_disconnect(id: string) {
  await deleteConnection(id);

  return { connected: false };
}

export async function GET_databases(id: string) {
  const conn = await getConnection(id);

  return getDatabases(conn);
}

export async function POST_databases(id: string, database: string) {
  const conn = await getConnection(id);

  await setDatabase(conn, database);

  return { connected: true };
}
