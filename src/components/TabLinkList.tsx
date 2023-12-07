import React, { memo, useCallback } from 'react';

import { useTheme } from '@react-bulk/core';
import { Box, Button, Text } from '@react-bulk/web';

import ContextMenu from '@/components/ContextMenu';
import Icon from '@/components/Icon';
import Overable from '@/components/Overable';
import { TABS_GROUP_COLORS } from '@/constants/metrics';
import { groupBy } from '@/helpers/array.helper';
import { t } from '@/helpers/translate.helper';
import useHotkey from '@/hooks/useHotkey';
import useTabs from '@/hooks/useTabs';

function TabLinkList() {
  const theme = useTheme();
  const { active, close, setActive, tabs } = useTabs();

  const handlePressTab = useCallback(
    (e: MouseEvent, tabId: string) => {
      e.stopPropagation();
      setActive(tabId);
    },
    [setActive],
  );

  const handlePressInTab = useCallback(
    (e: MouseEvent, tabId: string) => {
      // Middle Button
      if (e.button === 1) {
        e.stopPropagation();
        e.preventDefault();
        close(tabId);
      }
    },
    [close],
  );

  const handleCloseTab = useCallback(
    (e: MouseEvent, tabId: string) => {
      e.stopPropagation();
      close(tabId);
    },
    [close],
  );

  const handleCloseTabsExcept = useCallback(
    (e: MouseEvent, tabId: string) => {
      e.stopPropagation();
      tabs.forEach((tab) => tab.id !== tabId && close(tab.id));
      setActive(tabId);
    },
    [tabs, close, setActive],
  );

  const closeTabHk = useHotkey({
    callback: () => close(active),
    ctrl: true,
    key: 'w',
  });

  return (
    <>
      {groupBy(tabs, 'group').map(({ data, key }, index) => {
        const groupColor = TABS_GROUP_COLORS[index % TABS_GROUP_COLORS.length];

        return (
          <Box key={key}>
            <Box bg={groupColor} p={0.5}>
              <Text center flex color={theme.contrast(groupColor)} numberOfLines={1} variant="caption">
                &nbsp;{key}&nbsp;
              </Text>
            </Box>

            <Box flex noWrap row mx="-1px">
              {data.map((tab) => {
                const isActive = active === tab.id;
                const textColor = theme.contrast(isActive ? 'primary' : 'background');
                const title = tab.title || t('New Tab');

                return (
                  <Box
                    key={tab.id}
                    id={`tab_${tab.id}`}
                    bg={isActive ? 'primary' : 'background'}
                    border="1px solid background.secondary"
                    borderRight="none"
                    maxw={200}
                    position="relative"
                    px={2}
                    onPress={(e: MouseEvent) => handlePressTab(e, tab.id)}
                    onPressIn={(e: MouseEvent) => handlePressInTab(e, tab.id)}
                  >
                    <ContextMenu>
                      <Overable p={1} onPress={(e: MouseEvent) => handleCloseTab(e, tab.id)}>
                        <Text variant="secondary">{t('Close')}</Text>
                      </Overable>
                      <Overable p={1} onPress={(e: MouseEvent) => handleCloseTabsExcept(e, tab.id)}>
                        <Text variant="secondary">{t('Close other tabs')}</Text>
                      </Overable>
                      <Overable p={1} onPress={(e: MouseEvent) => handleCloseTabsExcept(e, '')}>
                        <Text variant="secondary">{t('Close all tabs')}</Text>
                      </Overable>
                    </ContextMenu>

                    <Box center flex noWrap row title={title}>
                      {tab.icon && (
                        <Box mr={2}>
                          <Icon color={isActive ? 'contrast' : 'primary'} name={tab.icon} />
                        </Box>
                      )}
                      <Text flex color={textColor} numberOfLines={1} variant="secondary">
                        {title}
                      </Text>
                      <Button
                        circular
                        color={textColor}
                        ml={2}
                        size="xsmall"
                        title={`${t('Close')}${isActive ? ` ${closeTabHk.title}` : ''}`}
                        variant="text"
                        onPress={(e: MouseEvent) => handleCloseTab(e, tab.id)}
                      >
                        <Icon color={textColor} name="X" />
                      </Button>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Box>
        );
      })}
    </>
  );
}

export default memo(TabLinkList);
