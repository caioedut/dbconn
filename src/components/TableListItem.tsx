import { memo, useCallback } from 'react';

import { RbkStyle, useToaster } from '@react-bulk/core';
import { Box, Button, Text } from '@react-bulk/web';

import Icon from '@/components/Icon';
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

  const handleSelectTop = useCallback(
    async (e: Event, tableName: string, limit: number) => {
      e.stopPropagation();

      try {
        const response = await api.get('/query/topQuery', connection?.id, tableName, limit);

        add({
          props: { autoRun: true, sql: response.data },
        });
      } catch (err) {
        toaster.error(getError(err));
      }
    },
    [add, connection?.id],
  );

  return (
    <Box key={table.name} rawStyle={rawStyle} style={[{ '&:hover': { bg: 'primary.main.25' } }, style]}>
      <Box center noWrap row p={1} style={{ gap: 4 }}>
        <Box h={12} ml={1} w={12}>
          <Icon name="Table" size={12} />
        </Box>
        <Text flex ml={1} numberOfLines={1}>
          {table.name}
        </Text>
        <Button
          circular
          size="xsmall"
          title="SELECT TOP 10"
          variant="text"
          onPress={(e: Event) => handleSelectTop(e, table.name, 10)}
        >
          10
        </Button>
        <Button
          circular
          size="xsmall"
          title="SELECT TOP 1000"
          variant="text"
          onPress={(e: Event) => handleSelectTop(e, table.name, 1000)}
        >
          1000
        </Button>
      </Box>
    </Box>
  );
}

export default memo(TableListItem);
