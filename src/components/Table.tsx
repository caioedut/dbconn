import { useCallback, useEffect, useRef, useState } from 'react';

import { ReactElement } from '@react-bulk/core';
import { Box, Scrollable } from '@react-bulk/web';

import { RobotoMonoFont } from '@/fonts';

export type TableColumn<Model> = {
  body: (row: Model, column: TableColumn<Model>) => ReactElement;
  header: (column: TableColumn<Model>) => ReactElement;
};

export type TableProps = {
  columns: TableColumn<any>[];
  rows: any[];
};

const rowHeight = 24;

// TODO: custom table

export default function Table({ columns, rows = [] }: TableProps) {
  const scrollViewRef = useRef<HTMLElement>();

  const [visibleColumns, setVisibleColumns] = useState<number[]>([]);
  const [visibleRows, setVisibleRows] = useState<number[]>([]);

  const render = useCallback(() => {
    if (!scrollViewRef.current) return;

    const newVisibleRows: typeof visibleRows = [];

    let curPosY = 0;

    for (const index in rows) {
      curPosY += rowHeight;

      const minPosY = scrollViewRef.current.scrollTop - rowHeight;
      const maxPosY = scrollViewRef.current.clientHeight + scrollViewRef.current.scrollTop + rowHeight;

      if (curPosY >= minPosY && curPosY <= maxPosY) {
        newVisibleRows.push(Number(index));
      }
    }

    // setVisibleRows(newVisibleRows);
  }, [scrollViewRef, rows]);

  useEffect(() => {
    const $view = scrollViewRef.current;

    render();

    $view?.addEventListener('scroll', render);

    return () => {
      $view?.removeEventListener('scroll', render);
    };
  }, [scrollViewRef, render]);

  const cellStyle = {
    fontSize: 12,
    fontWeight: 500,
    letterSpacing: 0.5,
    px: 1,
    py: 0.5,
    textAlign: 'left',
    textTransform: 'none',
    w: 120,
  };

  const thStyle = {
    ...cellStyle,
    bg: 'background.secondary',
    border: '1px solid background',
  };

  const tdStyle = {
    ...cellStyle,
    bg: 'background',
    border: '1px solid background.secondary',
  };

  return (
    <Scrollable ref={scrollViewRef} className={RobotoMonoFont.className} style={{ overflow: 'auto' }}>
      <Box noWrap row position="sticky" t={0}>
        {columns.map((column, columnIndex) => {
          return (
            <Box key={columnIndex} l={0} position="sticky" style={thStyle}>
              {column.header(column)}
              {/*{isValidElement(column.header)*/}
              {/*  ? column.header*/}
              {/*  : column.header instanceof Function*/}
              {/*    ? column.header(column)*/}
              {/*    : null}*/}
            </Box>
          );
        })}
      </Box>
      <Box>
        {rows.map((row, rowIndex) => {
          // if (!visibleRows.includes(rowIndex)) {
          //   return <div key={rowIndex} style={{ height: rowHeight }} />;
          // }

          return (
            <Box key={rowIndex} noWrap row style={{ display: 'none' }}>
              {columns.map((column, columnIndex) => (
                <Box key={columnIndex} style={tdStyle}>
                  {column.body(row, column)}
                </Box>
              ))}
            </Box>
          );
        })}
      </Box>
    </Scrollable>
  );
}
