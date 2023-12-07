'use client';

import React, { useCallback, useEffect, useRef } from 'react';

import { Box, Button, Scrollable } from '@react-bulk/web';

import Icon from '@/components/Icon';
import QueryEditor from '@/components/QueryEditor';
import TabContentList from '@/components/TabContentList';
import TabLinkList from '@/components/TabLinkList';
import { TABS_HEIGHT } from '@/constants/metrics';
import { t } from '@/helpers/translate.helper';
import useHotkey from '@/hooks/useHotkey';
import useTabs from '@/hooks/useTabs';

export default function Page() {
  const { active, add, goTo, goToNext, goToPrev, tabs } = useTabs();

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

  useEffect(() => {
    document.querySelector(`#tab_${active}`)?.scrollIntoView({ behavior: 'smooth' });
  }, [tabs, active]);

  const newTabHk = useHotkey({
    callback: () => addQueryEditorTab(),
    ctrl: true,
    key: 't',
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
      <Box noWrap row h={TABS_HEIGHT}>
        <Scrollable ref={scrollRef} direction="horizontal" onWheel={handleScrollTabs}>
          <TabLinkList />

          <Box bg="background.secondary" mt="-1px" p="1px" position="sticky" right={0}>
            <Button
              flex
              corners={0}
              h={TABS_HEIGHT}
              style={{ boxShadow: 'none !important' }}
              title={`${t('New Tab')} ${newTabHk.title}`}
              variant="outline"
              w={TABS_HEIGHT}
              onPress={(e: MouseEvent) => handleAddTab(e)}
            >
              <Icon name="Plus" size={18} />
            </Button>
          </Box>
        </Scrollable>
      </Box>

      <TabContentList />
    </>
  );
}
