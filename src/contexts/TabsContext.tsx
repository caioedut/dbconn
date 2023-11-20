import { Dispatch, SetStateAction, createContext, useCallback, useState } from 'react';
import { useListState } from 'react-state-hooks';

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

const TabsContext = createContext<{
  active: string;
  add: (tab?: Partial<Omit<Tab, 'id'>>) => string;
  close: (tabId: string) => void;
  goTo: (index: number) => void;
  goToNext: () => void;
  goToPrev: () => void;
  setActive: Dispatch<SetStateAction<string>>;
  setConnection: (tabId: string, connection?: Connection) => void;
  setDatabase: (tabId: string, database?: Database) => void;
  setTitle: (tabId: string, title: string) => void;
  tabs: Tab[];
}>({} as any);

function TabsProvider({ children }: any) {
  const { connection, database } = useConnection();

  const [active, setActive] = useState<string>('0');

  const [tabs, { push, remove, update }] = useListState<Tab>([{ id: '0', connection, database }]);

  const add = useCallback(
    (tab?: Partial<Omit<Tab, 'id'>>) => {
      const id = uuid();
      setActive(id);

      push({
        connection: tab?.connection ?? connection,
        database: tab?.database ?? database,
        ...tab,
        id,
      });

      return id;
    },
    [connection, database, push],
  );

  const close = useCallback(
    (tabId: string) => {
      if (tabId === active) {
        const index = tabs.findIndex((item) => item.id === tabId);
        const prev = tabs[index - 1];
        const next = tabs[index + 1];
        setActive(prev?.id ?? next?.id ?? '0');
      }

      remove((item) => item.id === tabId);
    },
    [active, remove, tabs],
  );

  const setProp = useCallback(
    (tabId: string, prop: string, value: any) => {
      const tab = tabs.find((item) => item.id === tabId);

      if (tab) {
        const index = tabs.indexOf(tab);
        update(index, { ...tab, [prop]: value });
      }
    },
    [tabs, update],
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
    [tabs],
  );

  const goToNext = useCallback(() => {
    const index = tabs.findIndex((item) => item.id === active);
    goTo(index === tabs.length - 1 ? 0 : index + 1);
  }, [tabs, active, goTo]);

  const goToPrev = useCallback(() => {
    const index = tabs.findIndex((item) => item.id === active);
    goTo((index === 0 ? tabs.length : index) - 1);
  }, [tabs, active, goTo]);

  return (
    <TabsContext.Provider
      value={{
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
      }}
    >
      {children}
    </TabsContext.Provider>
  );
}

export { TabsContext, TabsProvider };
