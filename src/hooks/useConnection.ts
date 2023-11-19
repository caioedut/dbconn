import { useContext } from 'react';

import { ConnectionContext } from '@/contexts/ConnectionContext';

export default function useConnection() {
  return useContext(ConnectionContext);
}
