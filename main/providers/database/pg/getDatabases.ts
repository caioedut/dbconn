import { Client } from 'pg';

import { ConnRef } from '../../../types/database.type';

export default async function getDatabases(conn: ConnRef<Client>) {
  const { rows } = await conn.current.query('SELECT datname AS name FROM pg_database');

  return rows;
}
