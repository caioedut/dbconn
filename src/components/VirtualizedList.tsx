import { JSXElementConstructor, MutableRefObject, useCallback, useEffect, useMemo, useState } from 'react';

import { BoxProps, childrenize } from '@react-bulk/core';
import { Box } from '@react-bulk/web';

export type VirtualizedListProps = {
  rowFallbackComponent?: JSXElementConstructor<any> | string;
  rowHeight?: number;
  scrollViewRef: MutableRefObject<Element | undefined>;
} & BoxProps;

export default function VirtualizedList({
  children,
  rowFallbackComponent = 'div',
  rowHeight,
  scrollViewRef,
  ...rest
}: VirtualizedListProps) {
  const childrenArray = useMemo(() => childrenize(children), [children]);

  const [visible, setVisible] = useState<number[]>([]);

  const render = useCallback(() => {
    if (!scrollViewRef.current) return;

    const newVisible: typeof visible = [];

    let curPosY = 0;

    for (const index in childrenArray) {
      const child = childrenArray[index];
      const height = child?.props?.height ?? rowHeight ?? 0;

      curPosY += height;
      const minPosY = scrollViewRef.current.scrollTop - height;
      const maxPosY = scrollViewRef.current.clientHeight + scrollViewRef.current.scrollTop + height;

      if (curPosY >= minPosY && curPosY <= maxPosY) {
        newVisible.push(Number(index));
      }
    }

    setVisible(newVisible);
  }, [scrollViewRef, childrenArray, rowHeight]);

  useEffect(() => {
    const $view = scrollViewRef.current;

    render();

    $view?.addEventListener('scroll', render);

    return () => {
      $view?.removeEventListener('scroll', render);
    };
  }, [scrollViewRef, childrenArray, rowHeight, render]);

  return (
    <Box noRootStyles {...rest}>
      {childrenArray.map((child, index) => {
        if (visible.includes(index)) {
          return child;
        }

        const Component = rowFallbackComponent;
        const key = child?.key ?? index;
        const height = child?.props?.height ?? rowHeight ?? 0;
        const width = child?.props?.width;

        return <Component key={key} style={{ height, width }} />;
      })}
    </Box>
  );
}
