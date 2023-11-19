export default async function getTopQuery(table: string, count: number) {
  return `SELECT * FROM ${table} LIMIT ${count}`;
}
