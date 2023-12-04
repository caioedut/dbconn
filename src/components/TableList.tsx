import { memo, startTransition, useCallback, useDeferredValue, useMemo, useRef, useState } from 'react';

import { Box, Button, Input, Scrollable, Tabs } from '@react-bulk/web';

import Icon from '@/components/Icon';
import Panel from '@/components/Panel';
import State from '@/components/State';
import TableListItem from '@/components/TableListItem';
import VirtualizedList from '@/components/VirtualizedList';
import { string } from '@/helpers/string.helper';
import { t } from '@/helpers/translate.helper';
import useConnection from '@/hooks/useConnection';
import useHotkey from '@/hooks/useHotkey';
import useTableList from '@/hooks/useTableList';

function TableList() {
  const { connection, database } = useConnection();

  const scrollViewRef = useRef<Element>();
  const searchRef = useRef<HTMLInputElement>();

  const [tab, setTab] = useState<'table' | 'view'>('table');
  const [search, setSearch] = useState('');
  const [searchEnabled, setSearchEnabled] = useState(false);
  const deferredSearch = useDeferredValue(search);

  const {
    data: tables,
    error: errorTables,
    isValidating: isValidatingTables,
    mutate: mutateTables,
  } = useTableList(connection, database);

  const handleSearch = useCallback((_: any, value: string) => {
    scrollViewRef.current?.scrollTo({ behavior: 'instant', top: 0 });

    startTransition(() => {
      setSearch(value);
    });
  }, []);

  const searchTablesHk = useHotkey({
    callback: () => searchRef.current?.focus(),
    ctrl: true,
    key: 'f',
  });

  const cancelSearchHk = useHotkey({
    callback: () => handleSearch({}, ''),
    disabled: !searchEnabled,
    key: 'Escape',
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

  const filteredTables = useMemo(() => {
    const search = string(deferredSearch).trim();

    return (tables || [])
      .filter((table) => {
        if (table.type !== tab) {
          return false;
        }

        if (!search) {
          return true;
        }

        return [table.schema, table.name].filter(Boolean).join('.').toLowerCase().includes(search.toLowerCase());
      })
      .sort((a, b) => {
        if (!search) {
          return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
        }

        return a.name.indexOf(search) - b.name.indexOf(search);
      });
  }, [tables, tab, deferredSearch]);

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
              endAddon={
                search ? (
                  <Icon name="X" title={cancelSearchHk.title} onPress={(_: Event) => handleSearch(_, '')} />
                ) : null
              }
              placeholder={`${t('Search')}... ${searchTablesHk.title}`}
              size="small"
              value={search}
              onBlur={() => setSearchEnabled(false)}
              onChange={handleSearch}
              onFocus={() => setSearchEnabled(true)}
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
