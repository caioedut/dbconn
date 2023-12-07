import { Dispatch, SetStateAction, createContext, useCallback, useEffect, useMemo } from 'react';
import { useStoreState } from 'react-state-hooks';

import { ReactElement } from '@react-bulk/core';
import { v4 as uuid } from 'uuid';

import QueryEditor from '@/components/QueryEditor';
import useConnection from '@/hooks/useConnection';
import { Connection, Database } from '@/types/database.type';

export type Tab = {
  connection?: Connection;
  database?: Database;
  group?: string;
  icon?: string;
  id: string;
  render: (props: Omit<Tab, 'render'>) => ReactElement;
  title?: string;
};

const TabsContext = createContext<{
  active: string;
  add: (tab: Partial<Omit<Tab, 'group' | 'id'>>) => string;
  close: (tabId: string) => void;
  goTo: (index: number) => void;
  goToNext: () => void;
  goToPrev: () => void;
  setActive: Dispatch<SetStateAction<string>>;
  setGroup: (tabId: string, group: string) => void;
  setProp: (tabId: string, prop: string, value: any) => void;
  setTitle: (tabId: string, title: string) => void;
  tabs: Tab[];
}>({} as any);

function TabsProvider({ children }: any) {
  const [active, setActive] = useStoreState<string>('tabs.active', '0');

  const { connection, database } = useConnection();

  const [tabs, setTabs] = useStoreState<Tab[]>('tabs', [
    {
      id: '0',
      title: 'Query',
      connection,
      database,
      group: [connection?.name, database?.name].filter(Boolean).join(' : '),
      icon: 'File',
      render: () => <QueryEditor />,
    },
    {
      id: '1',
      title: 'Query',
      connection,
      database,
      group: [connection?.name, database?.name].filter(Boolean).join(' : '),
      icon: 'File',
      render: () => <QueryEditor />,
    },
  ]);

  const getMetaData = useCallback(
    (tab?: Partial<Tab>) => {
      const conn = tab?.connection ?? connection;
      const db = tab?.database ?? database;

      const group = [conn?.name, db?.name].filter(Boolean).join(' : ');
      const title = `${(conn?.name || conn?.host) ?? '-----'} /// ${db?.name ?? '-----'} /// ${conn?.user ?? '-----'}`;

      return { title, group };
    },
    [connection, database],
  );

  const add = useCallback(
    (tab: Partial<Omit<Tab, 'group' | 'id'>>) => {
      const id = uuid();

      setActive(id);
      setTabs((current) => [...current, { ...getMetaData(tab), ...tab, id } as Tab]);

      return id;
    },
    [getMetaData, setActive, setTabs],
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

        Object.assign(tab, getMetaData(tab));

        setTabs((current) => [...current]);
      }
    },
    [getMetaData, setTabs, tabs],
  );

  const setTitle = useCallback(
    (tabId: string, title: string) => {
      setProp(tabId, 'title', title);
    },
    [setProp],
  );

  const setGroup = useCallback(
    (tabId: string, group: string) => {
      setProp(tabId, 'group', group);
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

  const value = useMemo(
    () => ({
      active,
      add,
      close,
      goTo,
      goToNext,
      goToPrev,
      setActive,
      setGroup,
      setProp,
      setTitle,
      tabs,
    }),
    [active, add, close, goTo, goToNext, goToPrev, setActive, setGroup, setProp, setTitle, tabs],
  );

  return <TabsContext.Provider value={value}>{children}</TabsContext.Provider>;
}

export { TabsContext, TabsProvider };
