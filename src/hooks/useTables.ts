import { useStoreState } from 'react-state-hooks';

import { AnyObject } from '@react-bulk/core';

import useApiOnce from '@/hooks/useApiOnce';
import api from '@/services/api';
import { Column, Connection, Database, Table } from '@/types/database.type';

export default function useTables(connection?: Connection, database?: Database) {
  const [columns, setColumns] = useStoreState<AnyObject>('tables.columns', {});

  const { data: tables } = useApiOnce<Table[]>(connection && database && '/tables', connection?.id, database?.name);

  const getColumns = async (tableName: string): Promise<Column[]> => {
    const index = `${connection?.id}_${database?.name}_${tableName}`;

    if (!columns?.[index]?.length) {
      const { data } = await api.get('/tables/columns', connection?.id, tableName);
      columns[index] = data;
      setColumns((current) => ({ ...current, [index]: data }));
    }

    return columns[index];
  };

  return { getColumns, tables };
}
