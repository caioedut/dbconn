import getConnection from '../providers/database/getConnection';
import service from '../providers/database/service';

export async function POST_index(id: string, query: string) {
  const conn = await getConnection(id);

  return service(conn.type, 'query')(conn, query);
}

export async function GET_topQuery(id: string, table: string, count: number) {
  const conn = await getConnection(id);

  return service(conn.type, 'getTopQuery')(table, count);
}
