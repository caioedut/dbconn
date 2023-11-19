import getConnection from '../providers/database/getConnection';
import service from '../providers/database/service';

export async function GET_index(id: string) {
  const conn = await getConnection(id);

  return service(conn.type, 'getTables')(conn);
}
