import { useToaster } from '@react-bulk/core';
import { Box, Text } from '@react-bulk/web';

import Icon from '@/components/Icon';
import State from '@/components/State';
import { getError } from '@/helpers/api.helper';
import useApiOnce from '@/hooks/useApiOnce';
import useConnection from '@/hooks/useConnection';
import api from '@/services/api';
import { Connection, Database } from '@/types/database.type';

export type DatabaseListItemProps = {
  connection: Connection;
};

export default function DatabaseList({ connection }: DatabaseListItemProps) {
  const toaster = useToaster();

  const { database, setConnection, setDatabase } = useConnection();

  const isConnected = Boolean(connection.connected);

  const { data: databases, error: errorDatabases } = useApiOnce<Database[]>(
    isConnected && '/connections/databases',
    connection.id,
  );

  const handleSelectDatabase = async (e: Event, db: Database) => {
    e.stopPropagation();

    if (db.name !== database?.name) {
      try {
        await api.post('/connections/databases', connection.id, db.name);
        setConnection(connection);
        setDatabase(db);
      } catch (err) {
        toaster.error(getError(err));
      }
    }
  };

  if (!isConnected) {
    return null;
  }

  return (
    <State error={errorDatabases}>
      <Box mb={2}>
        {databases?.map((db, index) => {
          const isSelected = db.name === database?.name;

          return (
            <Box
              key={index}
              style={{ '&:hover': { bg: 'primary.main.25' } }}
              onPress={(e: Event) => handleSelectDatabase(e, db)}
            >
              <Box center noWrap row p={1}>
                <Box center h={14} ml={1} title="Selected" w={14}>
                  {isSelected && <Icon name="ChevronsRight" size={14} />}
                </Box>
                <Text
                  flex
                  bold={isSelected}
                  color={isSelected ? 'primary' : 'text'}
                  ml={2}
                  numberOfLines={1}
                  variant="secondary"
                >
                  {db.name}
                </Text>
              </Box>
            </Box>
          );
        })}
      </Box>
    </State>
  );
}
