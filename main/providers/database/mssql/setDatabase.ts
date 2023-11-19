import mssql, { Connection } from 'mssql';

import { ConnRef } from '../../../types/database.type';

export default async function setDatabase(conn: ConnRef<Connection>, database: string) {
  return new Promise((resolve, reject) => {
    conn.current.connect(async (error) => {
      if (error) {
        return reject(error);
      }

      await mssql.query(`USE ${database}`);
      conn.database = database;

      resolve(database);
    });
  });
}
