import { ConnRef } from '../../types/database.type';

export default async function setPassword(conn: ConnRef, password: string) {
  const rawQuery = {
    mssql: `ALTER LOGIN [${conn.user}] WITH PASSWORD=N'${password}' OLD_PASSWORD=N'${conn.password}'`,
    mysql: `ALTER USER '${conn.user}'@'${conn.host}' IDENTIFIED BY '${password}'`,
    pg: `ALTER USER ${conn.user} WITH PASSWORD '${password}'`,
  }[conn.type];

  const result = await conn.current.query(rawQuery);

  console.log(result);

  if ('error' in result) {
    throw result;
  }

  conn.password = password;
}
