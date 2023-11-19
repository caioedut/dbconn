import { useContext } from 'react';

import { TabsContext } from '@/contexts/TabsContext';

export default function useTabs() {
  return useContext(TabsContext);
}
