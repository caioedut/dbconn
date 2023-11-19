import { Dispatch, SetStateAction, createContext, useEffect, useState } from 'react';
import { useListState } from 'react-state-hooks';

import { ReactElement } from '@react-bulk/core';
import { v4 as uuid } from 'uuid';

import QueryEditor from '@/components/QueryEditor';

type Tab = {
  id: string;
  render: () => ReactElement;
  title: string;
};

const TabsContext = createContext<{
  active: string;
  add: (tab?: Partial<Omit<Tab, 'id'>>) => string;
  close: (tabId: string) => void;
  setActive: Dispatch<SetStateAction<string>>;
  tabs: Tab[];
}>({} as any);

const defaultTab = {
  id: '0',
  title: 'Query',
  render: () => <QueryEditor />,
};

function TabsProvider({ children }: any) {
  const [active, setActive] = useState('0');

  const [tabs, { push, remove }] = useListState<Tab>([defaultTab]);

  const add = (tab?: Partial<Omit<Tab, 'id'>>) => {
    const id = uuid();
    push({ ...defaultTab, ...tab, id });
    setActive(id);
    return id;
  };

  const close = (tabId: string) => {
    if (tabId === active) {
      const index = tabs.findIndex((item) => item.id === tabId);
      const prev = tabs[index - 1];
      const next = tabs[index + 1];
      setActive(prev?.id ?? next?.id ?? defaultTab.id);
    }

    remove((item) => item.id === tabId);
  };

  useEffect(() => {
    if (!tabs.length) {
      push(defaultTab);
      setActive(defaultTab.id);
    }
  }, [tabs.length, push]);

  return (
    <TabsContext.Provider
      value={{
        active,
        add,
        close,
        setActive,
        tabs,
      }}
    >
      {children}
    </TabsContext.Provider>
  );
}

export { TabsContext, TabsProvider };
