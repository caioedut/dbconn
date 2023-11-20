import { Dispatch, SetStateAction, createContext, useMemo, useState } from 'react';

import { Connection, Database } from '@/types/database.type';

const ConnectionContext = createContext<{
  connection?: Connection;
  database?: Database;
  setConnection: Dispatch<SetStateAction<Connection | undefined>>;
  setDatabase: Dispatch<SetStateAction<Database | undefined>>;
}>({} as any);

function ConnectionProvider({ children }: any) {
  const [connection, setConnection] = useState<Connection>();
  const [database, setDatabase] = useState<Database>();

  const value = useMemo(
    () => ({
      connection,
      database,
      setConnection,
      setDatabase,
    }),
    [connection, database],
  );

  return <ConnectionContext.Provider value={value}>{children}</ConnectionContext.Provider>;
}

export { ConnectionContext, ConnectionProvider };
