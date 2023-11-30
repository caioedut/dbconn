import mssql from 'mssql';
import mysql from 'mysql2/promise';
import { Client } from 'pg';

import { Connect } from '../../types/database.type';

export default async function connect(options: Connect, check = true) {
  const { database, host, password, port, type, user } = options;

  let conn: any;

  if (type === 'mssql') {
    conn = await mssql.connect({
      database: database ?? undefined,
      options: { encrypt: false },
      password: password ?? undefined,
      port: port ? Number(port) : undefined,
      server: host ?? undefined,
      user: user ?? undefined,
    });

    conn.destroy = conn.close;
  }

  if (type === 'mysql') {
    conn = await mysql.createConnection({
      database: database ?? undefined,
      host: host ?? undefined,
      password: password ?? undefined,
      port: port ? Number(port) : undefined,
      user: user ?? undefined,
    });

    conn.destroy = conn.end;
  }

  if (type === 'pg') {
    conn = new Client({
      database: database ?? undefined,
      host: host ?? undefined,
      password: password ?? undefined,
      port: port ? Number(port) : undefined,
      user: user ?? undefined,
    });

    await conn.connect();

    conn.destroy = conn.end;
  }

  if (check) {
    try {
      await conn.query('SELECT 1');
    } catch (err) {
      if (err instanceof Error) {
        throw err;
      }

      throw new Error(`Unable to connect into "${options.host}"`);
    }
  }

  return conn;
}
