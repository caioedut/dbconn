import React, { MutableRefObject, useEffect, useMemo, useRef, useState } from 'react';

import { BoxProps } from '@react-bulk/core';
import { Card } from '@react-bulk/web';

export type ContextMenuProps = {
  containerRef?: MutableRefObject<HTMLElement | undefined>;
} & Pick<BoxProps, 'children'>;

export default function ContextMenu({ children, containerRef }: ContextMenuProps) {
  const cardRef = useRef<HTMLElement>();

  const [visible, setVisible] = useState(false);
  const [positions, setPositions] = useState({ left: 0, top: 0 });

  const width = useMemo(() => 200, []);

  useEffect(() => {
    const $container = containerRef ? containerRef.current : cardRef.current?.parentElement;

    if (!$container) return;

    const handler = (e: MouseEvent) => {
      e.preventDefault();

      const left = Math.min(window.innerWidth - width, e.pageX);

      setVisible(true);
      setPositions({ left, top: e.pageY });
    };

    $container.addEventListener('contextmenu', handler);

    return () => {
      $container.removeEventListener('contextmenu', handler);
    };
  }, [containerRef, cardRef, width]);

  useEffect(() => {
    if (!visible) return;

    const handler = () => {
      setVisible(false);
    };

    document.addEventListener('click', handler);
    document.addEventListener('keydown', handler);

    return () => {
      document.removeEventListener('click', handler);
      document.removeEventListener('keydown', handler);
    };
  }, [visible]);

  return (
    <Card
      ref={cardRef}
      border="1px solid text"
      hidden={!visible}
      p={0}
      position="fixed"
      w={width}
      zIndex={9999}
      {...positions}
    >
      {children}
    </Card>
  );
}
