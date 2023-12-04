import React, { memo, useCallback, useMemo } from 'react';

import { useToaster } from '@react-bulk/core';
import { Box, Button, Text } from '@react-bulk/web';

import Icon from '@/components/Icon';
import Overable from '@/components/Overable';
import QueryEditor from '@/components/QueryEditor';
import TableDetails from '@/components/TableDetails';
import { getError } from '@/helpers/api.helper';
import { t } from '@/helpers/translate.helper';
import useConnection from '@/hooks/useConnection';
import useTabs from '@/hooks/useTabs';
import api from '@/services/api';
import { Table } from '@/types/database.type';

export type TableListItemProps = {
  table: Table;
};

function TableListItem({ table }: TableListItemProps) {
  const toaster = useToaster();

  const { connection, database } = useConnection();

  const { add } = useTabs();

  const tableTitle = useMemo(() => [table.schema, table.name].filter(Boolean).join('.'), [table]);

  const handleSelectTop = useCallback(
    async (e: Event, limit: number) => {
      e.stopPropagation();

      try {
        const response = await api.get('/query/topQuery', connection?.id, tableTitle, limit);

        add({
          group: [connection?.name, database?.name].filter(Boolean).join(' : '),
          icon: 'File',
          render: ({ id }) => <QueryEditor autoRun sql={response.data} tabId={id} />,
        });
      } catch (err) {
        toaster.error(getError(err));
      }
    },
    [tableTitle, add, connection?.id, database?.name, toaster],
  );

  const handleTableDetails = useCallback(() => {
    add({
      title: table.name,
      group: [connection?.name, database?.name].filter(Boolean).join(' : '),
      icon: 'Table',
      render: () => <TableDetails connection={connection} table={table} />,
    });
  }, [add, connection, database, table]);

  return (
    <Overable key={table.name} style={{ cursor: 'pointer' }} onDoubleClick={handleTableDetails}>
      <Box center noWrap row p={1} style={{ gap: 4 }}>
        <Button circular ml={1} size="xsmall" title={t('Table Info')} variant="text" onPress={handleTableDetails}>
          <Icon name="Table" size={12} />
        </Button>

        <Text flex ml={1} numberOfLines={1}>
          {tableTitle}
        </Text>
        <Button
          circular
          size="xsmall"
          title="SELECT TOP 10"
          variant="text"
          onPress={(e: Event) => handleSelectTop(e, 10)}
        >
          10
        </Button>
        <Button
          circular
          size="xsmall"
          title="SELECT TOP 1000"
          variant="text"
          onPress={(e: Event) => handleSelectTop(e, 1000)}
        >
          1000
        </Button>
      </Box>
    </Overable>
  );
}

export default memo(TableListItem);
