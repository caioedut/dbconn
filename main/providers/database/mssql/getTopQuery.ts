export default async function getTopQuery(table: string, count: number) {
  return `SELECT TOP ${count} * FROM ${table}`;
}
