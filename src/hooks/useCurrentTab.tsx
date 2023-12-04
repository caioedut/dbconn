import { useContext } from 'react';

import { CurrentTabContext } from '@/contexts/CurrentTabContext';

export default function useCurrentTab() {
  return useContext(CurrentTabContext);
}
