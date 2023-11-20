import { memo, useMemo, useState } from 'react';
import { AutoSizer, List } from 'react-virtualized';

import { useTheme } from '@react-bulk/core';
import { Box, Button, Scrollable, Tabs } from '@react-bulk/web';

import Icon from '@/components/Icon';
import Panel from '@/components/Panel';
import State from '@/components/State';
import TableListItem from '@/components/TableListItem';
import { t } from '@/helpers/translate.helper';
import useApiOnce from '@/hooks/useApiOnce';
import useConnection from '@/hooks/useConnection';
import useHotkey from '@/hooks/useHotkey';
import { Table } from '@/types/database.type';

function TableList() {
  const { connection, database } = useConnection();

  const [tablesTab, setTablesTab] = useState<'table' | 'view'>('table');

  const {
    data: tables,
    error: errorTables,
    isValidating: isValidatingTables,
    mutate: mutateTables,
  } = useApiOnce<Table[]>(connection && database && '/tables', connection?.id, database?.name);

  const displayTablesHk = useHotkey({
    callback: () => setTablesTab('table'),
    ctrl: true,
    key: 'F1',
  });

  const displayViewsHk = useHotkey({
    callback: () => setTablesTab('view'),
    ctrl: true,
    key: 'F2',
  });

  const filteredTables = useMemo(() => (tables || []).filter((table) => table.type === tablesTab), [tables, tablesTab]);

  return (
    <Panel
      h="100%"
      loading={isValidatingTables}
      right={
        <Button circular size="xsmall" title={t('Refresh')} variant="text" onPress={() => mutateTables()}>
          <Icon color="contrast" name="RefreshCw" />
        </Button>
      }
      title={t('Structs')}
    >
      <State error={errorTables}>
        <Box center p={2}>
          <Tabs
            size="small"
            tabs={[
              { title: displayTablesHk.title, label: t('Tables'), value: 'table' },
              { title: displayViewsHk.title, label: t('Views'), value: 'view' },
            ]}
            value={tablesTab}
            variant="nav"
            onChange={(_, value: any) => setTablesTab(value)}
          />
        </Box>

        <Box flex>
          <AutoSizer>
            {({ height, width }) => (
              <List
                className="rbk-scroll-bar"
                height={height}
                rowCount={filteredTables?.length || 0}
                rowHeight={26}
                rowRenderer={({ index, key, style }) => (
                  <TableListItem key={key} rawStyle={style} table={filteredTables[index]} />
                )}
                width={width}
              />
            )}
          </AutoSizer>
        </Box>
      </State>
    </Panel>
  );
}

export default memo(TableList);
