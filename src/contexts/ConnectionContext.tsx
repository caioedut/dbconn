import { Dispatch, SetStateAction, createContext, useState } from 'react';

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

  return (
    <ConnectionContext.Provider
      value={{
        connection,
        database,
        setConnection,
        setDatabase,
      }}
    >
      {children}
    </ConnectionContext.Provider>
  );
}

export { ConnectionContext, ConnectionProvider };
