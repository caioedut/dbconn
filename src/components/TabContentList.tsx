import React, { memo } from 'react';

import { Box } from '@react-bulk/web';

import { TABS_HEIGHT } from '@/constants/metrics';
import { CurrentTabProvider } from '@/contexts/CurrentTabContext';
import useTabs from '@/hooks/useTabs';

function TabContentList() {
  const { active, tabs } = useTabs();

  return (
    <>
      {tabs.map(({ render, ...tab }) => {
        const isActive = active === tab.id;

        return (
          <Box key={tab.id} h={`calc(100% - ${TABS_HEIGHT}px)`} hidden={!isActive}>
            <CurrentTabProvider tabId={tab.id}>{render(tab)}</CurrentTabProvider>
          </Box>
        );
      })}
    </>
  );
}

export default memo(TabContentList);
