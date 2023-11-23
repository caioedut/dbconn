import React, { memo, useCallback, useMemo } from 'react';

import { RbkStyle, useToaster } from '@react-bulk/core';
import { Box, Button, Text } from '@react-bulk/web';

import Icon from '@/components/Icon';
import QueryEditor from '@/components/QueryEditor';
import TableDetails from '@/components/TableDetails';
import { getError } from '@/helpers/api.helper';
import useConnection from '@/hooks/useConnection';
import useTabs from '@/hooks/useTabs';
import api from '@/services/api';
import { Table } from '@/types/database.type';

export type TableListItemProps = {
  rawStyle?: RbkStyle;
  style?: RbkStyle;
  table: Table;
};

function TableListItem({ rawStyle, style, table }: TableListItemProps) {
  const toaster = useToaster();

  const { connection } = useConnection();

  const { add } = useTabs();

  const tableTitle = useMemo(() => [table.schema, table.name].filter(Boolean).join('.'), [table]);

  const handleSelectTop = useCallback(
    async (e: Event, limit: number) => {
      e.stopPropagation();

      try {
        const response = await api.get('/query/topQuery', connection?.id, tableTitle, limit);

        add({
          render: ({ id }) => <QueryEditor autoRun sql={response.data} tabId={id} />,
        });
      } catch (err) {
        toaster.error(getError(err));
      }
    },
    [tableTitle, add, connection?.id, toaster],
  );

  const handleTableDetails = useCallback(() => {
    add({
      title: table.name,
      render: () => <TableDetails connection={connection} table={table} />,
    });
  }, [add, connection, table]);

  return (
    <Box
      key={table.name}
      rawStyle={rawStyle}
      style={[{ '&:hover': { bg: 'primary.main.25' } }, style]}
      onDoubleClick={handleTableDetails}
    >
      <Box center noWrap row p={1} style={{ gap: 4 }}>
        <Box h={12} ml={1} w={12}>
          <Icon name="Table" size={12} />
        </Box>
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
    </Box>
  );
}

export default memo(TableListItem);
