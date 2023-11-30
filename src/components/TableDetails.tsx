import { useCallback } from 'react';
import { useListState } from 'react-state-hooks';

import { Box, Checkbox, Scrollable, Text } from '@react-bulk/web';

import Icon from '@/components/Icon';
import Overable from '@/components/Overable';
import Panel from '@/components/Panel';
import State from '@/components/State';
import TableResults from '@/components/TableResults';
import { t } from '@/helpers/translate.helper';
import useApiOnce from '@/hooks/useApiOnce';
import { Column, Connection, Table } from '@/types/database.type';

export type TableDetailsProps = {
  connection?: Connection;
  table: Table;
};

export default function TableDetails({ connection, table }: TableDetailsProps) {
  const [hiddenColumns, { push, remove }] = useListState<string>();

  const {
    data: columns,
    error: errorColumns,
    isValidating: isValidatingColumns,
    mutate: mutateColumns,
  } = useApiOnce<Column[]>('/tables/columns', connection?.id, table.fullName);

  const {
    data: rows,
    error: errorRows,
    isValidating: isValidatingRows,
    mutate: mutateRows,
  } = useApiOnce<Column[]>('/tables/rows', connection?.id, table.fullName);

  const handleToogleColumn = useCallback(
    (column: Column) => {
      if (hiddenColumns.includes(column.name)) {
        remove((item) => item === column.name);
      } else {
        push(column.name);
      }
    },
    [hiddenColumns, push, remove],
  );

  return (
    <Box noWrap row h="100%">
      <Box w={240}>
        <Panel flex h="100%" loading={isValidatingColumns} title={t('Columns')} onRefresh={() => mutateColumns()}>
          <State error={errorColumns}>
            <Scrollable style={{ overflow: 'auto' }}>
              {columns?.map((column) => (
                <Overable key={column.name} px={2} py={1} onPress={() => handleToogleColumn(column)}>
                  <Box noWrap row alignItems="center">
                    <Checkbox //
                      readOnly
                      checked={!hiddenColumns.includes(column.name)}
                      my={-1}
                      size="small"
                    />
                    <Text ml={1} variant="secondary">
                      {column.name}
                    </Text>
                    {column.columnKey === 'PK' && (
                      <Box ml={2} style={{ rotate: '180deg' }} title={t('Primary Key')}>
                        <Icon color="yellow" name="Key" size={14} />
                      </Box>
                    )}
                    {column.nullable === 'YES' && (
                      <Text color="warning" letterSpacing={1} lineHeight={1} ml={2} size={0.6}>
                        NULL
                      </Text>
                    )}
                    <Box ml="auto" />
                    <Text color="text.disabled" ml={2} variant="secondary">
                      {column.type}
                      {column.maxLength ? `(${column.maxLength})` : ''}
                    </Text>
                  </Box>
                </Overable>
              ))}
            </Scrollable>
          </State>
        </Panel>
      </Box>
      <Box flex>
        <Panel flex h="100%" loading={isValidatingRows} ml={1} title={t('Results')} onRefresh={() => mutateRows()}>
          <State error={errorRows}>
            <TableResults fields={columns?.filter((column) => !hiddenColumns.includes(column.name))} rows={rows} />
          </State>
        </Panel>
      </Box>
    </Box>
  );
}
