import { Fragment, createContext, useCallback, useEffect, useMemo, useState } from 'react';

import { Box, Divider, Text } from '@react-bulk/web';

import useConnection from '@/hooks/useConnection';
import useTabs, { Tab } from '@/hooks/useTabs';

const CurrentTabContext = createContext({
  tabs: {},
} as any);

function CurrentTabProvider({ children, tabId }: any) {
  const { setProp, tabs } = useTabs();

  const connContext = useConnection();

  const tab = useMemo(() => tabs.find(({ id }) => id === tabId), [tabId, tabs]) as Tab;

  const connection = useMemo(() => tab?.connection, [tab?.connection]);

  const database = useMemo(() => tab?.database, [tab?.database]);

  const [footer, _setFooter] = useState<(string | undefined)[]>([connection?.user]);

  const setFooter = useCallback(
    (value: string[]) => {
      _setFooter([connection?.user, ...value]);
    },
    [connection?.user],
  );

  useEffect(() => {
    if (!tab?.connection?.id) {
      setProp(tab?.id, 'connection', connContext.connection);
    }

    if (!tab?.database?.name) {
      setProp(tab?.id, 'database', connContext.database);
    }
  }, [connContext, setProp, tab]);

  return (
    <CurrentTabContext.Provider
      value={{
        ...tab,
        connection,
        database,
        footer,
        setFooter,
      }}
    >
      <Box h="calc(100% - 28px)">{children}</Box>

      <Box h={28}>
        <Box center flex noWrap row bg="primary" border="1px solid primary" mt={1} p={1}>
          <Box ml="auto" />

          {footer?.filter(Boolean)?.map((text, index) => (
            <Fragment key={index}>
              {index > 0 && <Divider vertical mx={2} />}

              <Text color="primary.contrast" variant="secondary">
                {text}
              </Text>
            </Fragment>
          ))}
        </Box>
      </Box>
    </CurrentTabContext.Provider>
  );
}

export { CurrentTabContext, CurrentTabProvider };
