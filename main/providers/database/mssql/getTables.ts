import mssql, { Connection } from 'mssql';

import { ConnRef } from '../../../types/database.type';

export default async function getTables(conn: ConnRef<Connection>) {
  return new Promise((resolve, reject) => {
    conn.current.connect(async (error) => {
      if (error) {
        return reject(error);
      }

      await mssql.query(`USE ${conn.database}`);

      return resolve(await mssql.query('SELECT name FROM sys.databases'));
    });
  });
}
