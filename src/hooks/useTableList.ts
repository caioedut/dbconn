import { useEffect, useMemo } from 'react';
import { useStoreState } from 'react-state-hooks';

import useApiOnce from '@/hooks/useApiOnce';
import api from '@/services/api';
import { Column, Connection, Database, Table } from '@/types/database.type';

export default function useTableList(connection?: Connection, database?: Database) {
  const index = useMemo(() => `${connection?.id ?? ''}${database?.name ?? ''}`, [connection?.id, database?.name]);

  const [cache, setCache] = useStoreState<{
    [key: string]: Table[] | undefined;
  }>('tables', {});

  const [columns, setColumns] = useStoreState<{
    [key: string]: Column[] | undefined;
  }>('tables.columns', {});

  const { data = cache[index], ...rest } = useApiOnce<Table[]>(
    connection?.id && database?.name && '/tables',
    connection?.id,
    database?.name,
  );

  useEffect(() => {
    if (!index) return;

    setCache((current) => ({
      ...current,
      [index]: data,
    }));
  }, [index, data, setCache]);

  const getColumns = async (tableName: string): Promise<Column[]> => {
    const index = `${connection?.id}_${database?.name}_${tableName}`;

    if (!columns?.[index]?.length) {
      const { data } = await api.get('/tables/columns', connection?.id, tableName);

      columns[index] = data;

      setColumns((current) => ({
        ...current,
        [index]: data,
      }));
    }

    return columns[index] ?? [];
  };

  return { data, getColumns, ...rest };
}
