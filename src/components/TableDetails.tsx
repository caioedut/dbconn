import { Box, Scrollable, Text } from '@react-bulk/web';

import Panel from '@/components/Panel';
import TableResults from '@/components/TableResults';
import { t } from '@/helpers/translate.helper';
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

  const {
    data: rows,
    error: errorRows,
    isValidating: isValidatingRows,
    mutate: mutateRows,
  } = useApiOnce<Column[]>('/tables/rows', connection?.id, table.fullName);

  return (
    <Box noWrap row h="100%">
      <Box w={240}>
        <Panel flex title={t('Columns')}>
          <Scrollable>
            {columns?.map((column) => {
              return (
                <Box key={column.name} px={2} py={1} style={{ '&:hover': { bg: 'primary.main.25' } }}>
                  <Text>
                    {column.name}{' '}
                    <Text color="text.disabled">
                      {column.type}
                      {column.maxLength ? `(${column.maxLength})` : ''}
                    </Text>
                  </Text>
                </Box>
              );
            })}
          </Scrollable>
        </Panel>
      </Box>
      <Box flex>
        <Panel flex h="100%" ml={1}>
          <TableResults fields={columns} rows={rows} />
        </Panel>
      </Box>
    </Box>
  );
}
