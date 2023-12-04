'use client';

import React, { useCallback, useEffect, useRef } from 'react';

import { useTheme } from '@react-bulk/core';
import { Box, Button, Scrollable, Text } from '@react-bulk/web';

import ContextMenu from '@/components/ContextMenu';
import Icon from '@/components/Icon';
import Overable from '@/components/Overable';
import QueryEditor from '@/components/QueryEditor';
import { CurrentTabProvider } from '@/contexts/CurrentTabContext';
import { groupBy } from '@/helpers/array.helper';
import { t } from '@/helpers/translate.helper';
import useHotkey from '@/hooks/useHotkey';
import useTabs from '@/hooks/useTabs';

const tabsHeight = 48;

const colors = [
  //
  '#85929E',
  '#A569BD',
  '#52BE80',
  '#EC7063',
  '#5499C7',
  '#F5B041',
];

export default function Page() {
  const theme = useTheme();
  const { active, add, close, goTo, goToNext, goToPrev, setActive, tabs } = useTabs();

  const scrollRef = useRef<HTMLDivElement>();

  const addQueryEditorTab = useCallback(() => {
    add({
      icon: 'File',
      render: () => <QueryEditor />,
    });
  }, [add]);

  const handleScrollTabs = useCallback(
    (e: MouseEvent) => {
      // @ts-expect-error
      scrollRef.current?.scrollBy(e.deltaY, 0);
    },
    [scrollRef],
  );

  const handleAddTab = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      addQueryEditorTab();
    },
    [addQueryEditorTab],
  );

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

  useEffect(() => {
    document.querySelector(`#tab_${active}`)?.scrollIntoView({ behavior: 'smooth' });
  }, [tabs, active]);

  const newTabHk = useHotkey({
    callback: () => addQueryEditorTab(),
    ctrl: true,
    key: 't',
  });

  const closeTabHk = useHotkey({
    callback: () => close(active),
    ctrl: true,
    key: 'w',
  });

  for (let i = 0; i < 10; i++) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useHotkey({
      callback: () => goTo(i),
      ctrl: true,
      key: `${i + 1}`,
    });
  }

  useHotkey({
    callback: () => goToNext(),
    ctrl: true,
    key: 'Tab',
  });

  useHotkey({
    callback: () => goToPrev(),
    ctrl: true,
    key: 'Tab',
    shift: true,
  });

  return (
    <>
      <Box noWrap row h={tabsHeight}>
        <Scrollable ref={scrollRef} direction="horizontal" onWheel={handleScrollTabs}>
          {groupBy(tabs, 'group').map(({ data, key }, index) => {
            const groupColor = colors[index % colors.length];

            return (
              <Box key={key}>
                <Box bg={groupColor} p={1}>
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

          <Box bg="background.secondary" mt="-1px" p="1px" position="sticky" right={0}>
            <Button
              flex
              corners={0}
              h={tabsHeight}
              style={{ boxShadow: 'none !important' }}
              title={`${t('New Tab')} ${newTabHk.title}`}
              variant="outline"
              w={tabsHeight}
              onPress={(e: MouseEvent) => handleAddTab(e)}
            >
              <Icon name="Plus" size={18} />
            </Button>
          </Box>
        </Scrollable>
      </Box>

      {tabs.map(({ render, ...tab }) => {
        const isActive = active === tab.id;

        return (
          <Box key={tab.id} h={`calc(100% - ${tabsHeight}px)`} hidden={!isActive}>
            <CurrentTabProvider tabId={tab.id}>{render(tab)}</CurrentTabProvider>
          </Box>
        );
      })}
    </>
  );
}
