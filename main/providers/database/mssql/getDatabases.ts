import mssql, { Connection } from 'mssql';

import { ConnRef } from '../../../types/database.type';

export default async function getDatabases(conn: ConnRef<Connection>) {
  return new Promise((resolve, reject) => {
    conn.current.connect(async (error) => {
      if (error) {
        return reject(error);
      }

      return resolve(await mssql.query('SELECT name FROM sys.databases'));
    });
  });
}
