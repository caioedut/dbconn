import knex from 'knex';

import { Connect } from '../../types/database.type';

export default async function connect(options: Connect) {
  const { database, host, password, port, type, user } = options;

  const client = type === 'mysql' ? 'mysql2' : type;

  return knex({
    client,
    connection: {
      database: database ?? undefined,
      host: host ?? undefined,
      password: password ?? undefined,
      port: port ? Number(port) : undefined,
      user: user ?? undefined,
    },
  });
}
