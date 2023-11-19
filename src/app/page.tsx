'use client';

import React from 'react';

import { useTheme } from '@react-bulk/core';
import { Box, Button, Text } from '@react-bulk/web';

import Icon from '@/components/Icon';
import { t } from '@/helpers/translate.helper';
import useTabs from '@/hooks/useTabs';

export default function Page() {
  const theme = useTheme();
  const { active, add, close, setActive, tabs } = useTabs();

  const handleAddTab = (e: Event) => {
    e.stopPropagation();

    add();
  };

  const handlePressTab = (e: Event, tabId: string) => {
    e.stopPropagation();

    setActive(tabId);
  };

  const handleCloseTab = (e: Event, tabId: string) => {
    e.stopPropagation();

    close(tabId);
  };

  return (
    <>
      <Box>
        {/*<Tabs*/}
        {/*  tabs={tabs.map((tab) => ({*/}
        {/*    label: tab.title,*/}
        {/*    value: tab.id,*/}
        {/*  }))}*/}
        {/*/>*/}

        <Box noWrap row>
          {tabs.map((tab) => {
            const isActive = active === tab.id;
            const textColor = theme.contrast(isActive ? 'primary' : 'background');

            return (
              <Box
                key={tab.id}
                bg={isActive ? 'primary' : 'background'}
                border="1px solid background.secondary"
                borderRight="none"
                p={2}
                onPress={(e: Event) => handlePressTab(e, tab.id)}
              >
                <Box center noWrap row>
                  <Box mr={2}>
                    <Icon color={textColor} name="Code" />
                  </Box>
                  <Text flex color={textColor} numberOfLines={1}>
                    {tab.title}
                  </Text>
                  <Button
                    circular
                    color={textColor}
                    ml={2}
                    size="xsmall"
                    title={t('Close')}
                    variant="text"
                    onPress={(e: Event) => handleCloseTab(e, tab.id)}
                  >
                    <Icon color={textColor} name="X" />
                  </Button>
                </Box>
              </Box>
            );
          })}

          <Button
            // bg={isActive ? 'primary' : 'background'}
            // border="1px solid primary"
            corners={0}
            // p={2}
            m="1px"
            style={{ boxShadow: 'none !important' }}
            title={t('New Tab')}
            variant="outline"
            onPress={(e: Event) => handleAddTab(e)}
          >
            <Icon name="Plus" />
          </Button>
        </Box>
      </Box>

      {tabs.map((tab) => {
        const isActive = active === tab.id;

        return (
          <Box key={tab.id} flex hidden={!isActive}>
            {tab.render()}
          </Box>
        );
      })}
      {/*<QueryEditor />*/}
    </>
  );
}
