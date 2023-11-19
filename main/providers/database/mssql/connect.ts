import mssql from 'mssql';

import { Connect } from '../../../types/database.type';

export default async function connect(options: Connect) {
  return mssql.connect({
    options: {
      encrypt: false, // for azure
      trustServerCertificate: false, // change to true for local dev / self-signed certs
    },
    password: options?.password,
    port: options?.port,
    server: options?.host,
    user: options?.username,
  });
}
