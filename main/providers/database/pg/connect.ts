import { Client } from 'pg';

import { Connect } from '../../../types/database.type';

export default async function connect(options: Partial<Connect>) {
  const client = new Client({
    database: options?.database,
    host: options?.host,
    password: options?.password,
    port: Number(options?.port || 5432),
    user: options?.username,
  });

  await client.connect();

  return client;
}
