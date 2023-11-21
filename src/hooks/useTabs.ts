import { useCallback, useMemo } from 'react';
import { useStoreState } from 'react-state-hooks';

import { v4 as uuid } from 'uuid';

import { QueryEditorProps } from '@/components/QueryEditor';
import useConnection from '@/hooks/useConnection';
import { Connection, Database } from '@/types/database.type';

export type Tab = {
  connection?: Connection;
  database?: Database;
  id: string;
  props?: Omit<QueryEditorProps, 'tab'>;
  title?: string;
};

export default function useTabs() {
  const { connection, database } = useConnection();

  const [tabs, setTabs] = useStoreState<Tab[]>('tabs', [{ id: '0', connection, database }]);

  const [active, setActive] = useStoreState<string>('tabs.active', '0');

  const add = useCallback(
    (tab?: Partial<Omit<Tab, 'id'>>) => {
      const id = uuid();

      setTabs((current) => {
        return [
          ...current,
          {
            connection: tab?.connection ?? connection,
            database: tab?.database ?? database,
            ...tab,
            id,
          },
        ];
      });

      setActive(id);

      return id;
    },
    [connection, database, setActive, setTabs],
  );

  const close = useCallback(
    (tabId: string) => {
      if (tabId === active) {
        const index = tabs.findIndex((item) => item.id === tabId);
        const prev = tabs[index - 1];
        const next = tabs[index + 1];
        setActive(prev?.id ?? next?.id ?? '0');
      }

      setTabs((current) => current.filter((item) => item.id !== tabId));
    },
    [active, setActive, setTabs, tabs],
  );

  const setProp = useCallback(
    (tabId: string, prop: string, value: any) => {
      const tab = tabs.find((item) => item.id === tabId);

      if (tab && tab?.[prop as keyof typeof tab] !== value) {
        tab[prop as keyof typeof tab] = value;
        setTabs((current) => [...current]);
      }
    },
    [setTabs, tabs],
  );

  const setTitle = useCallback(
    (tabId: string, title: string) => {
      setProp(tabId, 'title', title);
    },
    [setProp],
  );

  const setConnection = useCallback(
    (tabId: string, connection?: Connection) => {
      setProp(tabId, 'connection', connection);
    },
    [setProp],
  );

  const setDatabase = useCallback(
    (tabId: string, database?: Database) => {
      setProp(tabId, 'database', database);
    },
    [setProp],
  );

  const goTo = useCallback(
    (index: number) => {
      const tabId = tabs[index]?.id;
      tabId && setActive(tabId);
    },
    [setActive, tabs],
  );

  const goToNext = useCallback(() => {
    const index = tabs.findIndex((item) => item.id === active);
    goTo(index === tabs.length - 1 ? 0 : index + 1);
  }, [tabs, active, goTo]);

  const goToPrev = useCallback(() => {
    const index = tabs.findIndex((item) => item.id === active);
    goTo((index === 0 ? tabs.length : index) - 1);
  }, [tabs, active, goTo]);

  return useMemo(
    () => ({
      active,
      add,
      close,
      goTo,
      goToNext,
      goToPrev,
      setActive,
      setConnection,
      setDatabase,
      setTitle,
      tabs,
    }),
    [active, add, close, goTo, goToNext, goToPrev, setActive, setConnection, setDatabase, setTitle, tabs],
  );
}
