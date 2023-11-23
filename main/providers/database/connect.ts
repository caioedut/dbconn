import knex from 'knex';

import { Connect } from '../../types/database.type';

export default async function connect(options: Connect, check = true) {
  const { database, host, password, port, type, user } = options;

  const client = type === 'mysql' ? 'mysql2' : type;

  const conn = knex({
    client,
    connection: {
      database: database ?? undefined,
      host: host ?? undefined,
      password: password ?? undefined,
      port: port ? Number(port) : undefined,
      user: user ?? undefined,
    },
  });

  if (check) {
    try {
      await conn.raw('SELECT 1');
    } catch (err) {
      if (err instanceof Error) {
        throw err;
      }

      throw new Error(`Unable to connect into "${options.host}"`);
    }
  }

  return conn;
}
