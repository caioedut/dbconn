export function response(result: any) {
  let rows = [];
  let fields = [];

  // pg
  if ('rows' in result) {
    rows = result.rows;
    fields = result.fields;
  }

  // mssql
  if ('recordset' in result) {
    rows = result.recordset;
    fields = result.recordset.columns;
  }

  // // tedious (mssql)
  // if (Array.isArray(result) && result.length === 2) {
  //   rows = result[0];
  //   fields = result[1];
  // }

  // mysql
  if (Array.isArray(result) && result.length === 2) {
    rows = result[0];
    fields = result[1];
  }

  return { fields, rows };
}
