import { memo, startTransition, useCallback, useDeferredValue, useMemo, useRef, useState } from 'react';

import { RbkInputEvent } from '@react-bulk/core';
import { Box, Button, Input, Scrollable, Tabs } from '@react-bulk/web';

import Icon from '@/components/Icon';
import Panel from '@/components/Panel';
import State from '@/components/State';
import TableListItem from '@/components/TableListItem';
import VirtualizedList from '@/components/VirtualizedList';
import { string } from '@/helpers/string.helper';
import { t } from '@/helpers/translate.helper';
import useApiOnce from '@/hooks/useApiOnce';
import useConnection from '@/hooks/useConnection';
import useHotkey from '@/hooks/useHotkey';
import { Table } from '@/types/database.type';

function TableList() {
  const { connection, database } = useConnection();

  const scrollViewRef = useRef<Element>();
  const searchRef = useRef<HTMLInputElement>();

  const [tab, setTab] = useState<'table' | 'view'>('table');
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);

  const {
    data: tables,
    error: errorTables,
    isValidating: isValidatingTables,
    mutate: mutateTables,
  } = useApiOnce<Table[]>(connection && database && '/tables', connection?.id, database?.name);

  const handleSearch = useCallback((e: RbkInputEvent, value: string) => {
    startTransition(() => {
      setSearch(value);
    });
  }, []);

  const searchTablesHk = useHotkey({
    callback: () => searchRef.current?.focus(),
    ctrl: true,
    key: 'f',
  });

  const displayTablesHk = useHotkey({
    callback: () => setTab('table'),
    ctrl: true,
    key: 'F1',
  });

  const displayViewsHk = useHotkey({
    callback: () => setTab('view'),
    ctrl: true,
    key: 'F2',
  });

  const filteredTables = useMemo(
    () =>
      (tables || []).filter((table) => {
        if (table.type !== tab) {
          return false;
        }

        const search = string(deferredSearch).trim();

        if (!search) {
          return true;
        }

        return [table.schema, table.name].filter(Boolean).join('.').toLowerCase().includes(search.toLowerCase());
      }),
    [tables, tab, deferredSearch],
  );

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
      {Boolean(tables) && (
        <State error={errorTables}>
          <Box center p={2}>
            <Tabs
              size="small"
              tabs={[
                { title: displayTablesHk.title, label: t('Tables'), value: 'table' },
                { title: displayViewsHk.title, label: t('Views'), value: 'view' },
              ]}
              value={tab}
              variant="nav"
              onChange={(_, value: any) => setTab(value)}
            />
          </Box>

          <Box p={2} pt={0}>
            <Input
              ref={searchRef}
              placeholder={`${t('Search')}... ${searchTablesHk.title}`}
              size="small"
              value={search}
              onChange={handleSearch}
            />
          </Box>

          <Scrollable ref={scrollViewRef}>
            <VirtualizedList rowHeight={26} scrollViewRef={scrollViewRef}>
              {filteredTables?.map((table, index) => <TableListItem key={index} table={table} />)}
            </VirtualizedList>
          </Scrollable>
        </State>
      )}
    </Panel>
  );
}

export default memo(TableList);
