import { createContext, useMemo } from 'react';

import useConnection from '@/hooks/useConnection';
import useTabs from '@/hooks/useTabs';

const CurrentTabContext = createContext({
  tabs: {},
} as any);

function CurrentTabProvider({ children, tabId }: any) {
  const { tabs } = useTabs();

  const connContext = useConnection();

  const tab = useMemo(() => tabs.find(({ id }) => id === tabId), [tabId, tabs]);

  const connection = useMemo(
    () => tab?.connection ?? connContext?.connection,
    [connContext?.connection, tab?.connection],
  );

  const database = useMemo(() => tab?.database ?? connContext?.database, [connContext?.database, tab?.database]);

  return (
    <CurrentTabContext.Provider
      value={{
        ...tab,
        connection,
        database,
      }}
    >
      {children}
    </CurrentTabContext.Provider>
  );
}

export { CurrentTabContext, CurrentTabProvider };
