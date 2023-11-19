import mysql from 'mysql2';

import { Connect } from '../../../types/database.type';

export default async function connect(options: Connect) {
  return mysql.createConnection({
    host: options?.host,
    password: options?.password,
    port: options?.port,
    user: options?.username,
  });
}
