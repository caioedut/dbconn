import getConnection from '../providers/database/getConnection';
import getTables from '../providers/database/getTables';

export async function GET_index(id: string) {
  const conn = await getConnection(id);

  return getTables(conn);
}
