import Panel from '@/components/Panel';
import useApiOnce from '@/hooks/useApiOnce';
import { Column, Connection, Table } from '@/types/database.type';

export type TableDetailsProps = {
  connection?: Connection;
  table: Table;
};

export default function TableDetails({ connection, table }: TableDetailsProps) {
  const {
    data: columns,
    error: errorColumns,
    isValidating: isValidatingColumns,
    mutate: mutateColumns,
  } = useApiOnce<Column[]>('/tables/columns', connection?.id, table.name);

  console.log(columns);
  console.log(errorColumns);

  return (
    <>
      <Panel title={table.name}>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores aspernatur aut blanditiis distinctio
        explicabo illum in ipsam ipsum laudantium omnis, possimus unde veniam! Aspernatur cumque distinctio incidunt
        itaque! Dicta, placeat!
      </Panel>
    </>
  );
}
