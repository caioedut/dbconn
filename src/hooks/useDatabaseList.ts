import { useEffect, useMemo } from 'react';
import { useStoreState } from 'react-state-hooks';

import useApiOnce from '@/hooks/useApiOnce';
import { Connection, Database } from '@/types/database.type';

export default function useDatabaseList(connection?: Connection) {
  const index = useMemo(() => `${connection?.id ?? ''}`, [connection?.id]);

  const [cache, setCache] = useStoreState<{
    [key: string]: Database[] | undefined;
  }>('databases', {});

  const { data = cache[index], ...rest } = useApiOnce<Database[]>(
    connection?.id && '/connections/databases',
    connection?.id,
  );

  useEffect(() => {
    if (!index) return;

    setCache((current) => ({
      ...current,
      [index]: data,
    }));
  }, [index, data, setCache]);

  return { data, ...rest };
}
