import getConnection from '../providers/database/getConnection';
import getTopQuery from '../providers/database/getTopQuery';
import query from '../providers/database/query';

export async function POST_index(id: string, queryStr: string) {
  const conn = await getConnection(id);

  return query(conn, queryStr);
}

export async function GET_topQuery(id: string, table: string, count: number) {
  const conn = await getConnection(id);

  return getTopQuery(conn, table, count);
}
