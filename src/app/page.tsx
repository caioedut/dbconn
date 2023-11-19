'use client';

import React, { useEffect, useRef } from 'react';

import { useTheme } from '@react-bulk/core';
import { Box, Button, Scrollable, Text } from '@react-bulk/web';

import Icon from '@/components/Icon';
import QueryEditor from '@/components/QueryEditor';
import { t } from '@/helpers/translate.helper';
import useTabs from '@/hooks/useTabs';

export default function Page() {
  const theme = useTheme();
  const { active, add, close, setActive, tabs } = useTabs();

  const scrollRef = useRef<HTMLDivElement>();

  const handleScrollTabs = (e: MouseEvent) => {
    // @ts-expect-error
    scrollRef.current?.scrollBy(e.deltaY, 0);
  };

  const handleAddTab = (e: MouseEvent) => {
    e.stopPropagation();

    add();
  };

  const handlePressTab = (e: MouseEvent, tabId: string) => {
    e.stopPropagation();

    setActive(tabId);
  };

  const handlePressInTab = (e: MouseEvent, tabId: string) => {
    // Middle Button
    if (e.button === 1) {
      e.stopPropagation();
      e.preventDefault();
      close(tabId);
    }
  };

  const handleCloseTab = (e: MouseEvent, tabId: string) => {
    e.stopPropagation();

    close(tabId);
  };

  useEffect(() => {
    document.querySelector(`#tab_${active}`)?.scrollIntoView({ behavior: 'smooth' });
  }, [tabs, active]);

  return (
    <>
      <Box noWrap row border="1px solid primary">
        <Scrollable ref={scrollRef} direction="horizontal" onWheel={handleScrollTabs}>
          {tabs.map((tab) => {
            const isActive = active === tab.id;
            const textColor = theme.contrast(isActive ? 'primary' : 'background');
            const title = `${(tab?.connection?.name || tab?.connection?.host) ?? '-----'} /// ${
              tab?.database?.name ?? '-----'
            } /// ${tab?.connection?.username ?? '-----'}`;

            return (
              <Box
                key={tab.id}
                id={`tab_${tab.id}`}
                bg={isActive ? 'primary' : 'background'}
                border="1px solid background.secondary"
                borderRight="none"
                px={2}
                title={title}
                onPress={(e: MouseEvent) => handlePressTab(e, tab.id)}
                onPressIn={(e: MouseEvent) => handlePressInTab(e, tab.id)}
              >
                <Box center flex noWrap row maxw={200}>
                  <Text flex color={textColor} numberOfLines={1} variant="secondary">
                    {title}
                  </Text>
                  <Button
                    circular
                    color={textColor}
                    ml={2}
                    size="xsmall"
                    title={t('Close')}
                    variant="text"
                    onPress={(e: MouseEvent) => handleCloseTab(e, tab.id)}
                  >
                    <Icon color={textColor} name="X" />
                  </Button>
                </Box>
              </Box>
            );
          })}

          <Box bg="background.secondary" p="1px" position="sticky" right={0}>
            <Button
              flex
              corners={0}
              style={{ boxShadow: 'none !important' }}
              title={t('New Tab')}
              variant="outline"
              onPress={(e: MouseEvent) => handleAddTab(e)}
            >
              <Icon name="Plus" />
            </Button>
          </Box>
        </Scrollable>
      </Box>

      {tabs.map((tab) => {
        const isActive = active === tab.id;

        return (
          <Box key={tab.id} flex hidden={!isActive}>
            <QueryEditor tab={tab} {...tab.props} />
          </Box>
        );
      })}
    </>
  );
}
