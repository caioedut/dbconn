'use client';

import React, { useCallback, useEffect, useRef } from 'react';

import { useTheme } from '@react-bulk/core';
import { Box, Button, Scrollable, Text } from '@react-bulk/web';

import ContextMenu from '@/components/ContextMenu';
import Icon from '@/components/Icon';
import Overable from '@/components/Overable';
import QueryEditor from '@/components/QueryEditor';
import { t } from '@/helpers/translate.helper';
import useHotkey from '@/hooks/useHotkey';
import useTabs from '@/hooks/useTabs';

const tabsHeight = 36;

export default function Page() {
  const theme = useTheme();
  const { active, add, close, goTo, goToNext, goToPrev, setActive, tabs } = useTabs();

  const scrollRef = useRef<HTMLDivElement>();

  const addQueryEditorTab = useCallback(() => {
    add({
      icon: 'File',
      render: ({ id }) => <QueryEditor tabId={id} />,
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
          {tabs.map((tab) => {
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

                <Box center flex noWrap row maxw={200} title={title}>
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

          <Box bg="background.secondary" p="1px" position="sticky" right={0}>
            <Button
              flex
              corners={0}
              style={{ boxShadow: 'none !important' }}
              title={`${t('New Tab')} ${newTabHk.title}`}
              variant="outline"
              onPress={(e: MouseEvent) => handleAddTab(e)}
            >
              <Icon name="Plus" />
            </Button>
          </Box>
        </Scrollable>
      </Box>

      {tabs.map(({ render, ...tab }) => {
        const isActive = active === tab.id;

        return (
          <Box key={tab.id} h={`calc(100% - ${tabsHeight}px)`} hidden={!isActive}>
            {render(tab)}
          </Box>
        );
      })}
    </>
  );
}
