import { useMemo } from 'react';
import { useStoreState } from 'react-state-hooks';

import useApiOnce from '@/hooks/useApiOnce';
import { Connection, Database } from '@/types/database.type';

export type UseDatabaseListProps = {
  connection?: Connection;
};

export default function useDatabaseList({ connection }: UseDatabaseListProps) {
  const [cache, setCache] = useStoreState<{
    [key: string]: Database[] | undefined;
  }>('connection.databases', {});

  const defaultCurrent = cache[connection?.id as string];

  const { data = defaultCurrent, ...rest } = useApiOnce<Database[]>(
    connection && '/connections/databases',
    connection?.id,
  );

  useMemo(() => {
    if (!connection?.id) return;

    setCache((current) => ({
      ...current,
      [connection.id]: data,
    }));
  }, [connection, data, setCache]);

  return { data, ...rest };
}
