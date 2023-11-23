import getColumns from '../providers/database/getColumns';
import getConnection from '../providers/database/getConnection';
import getRows from '../providers/database/getRows';
import getTables from '../providers/database/getTables';

export async function GET_index(id: string) {
  const conn = await getConnection(id);

  return getTables(conn);
}

export async function GET_columns(id: string, table: string) {
  const conn = await getConnection(id);

  return getColumns(conn, table);
}

export async function GET_rows(id: string, table: string) {
  const conn = await getConnection(id);

  return getRows(conn, table);
}
