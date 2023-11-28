import React, { useCallback, useEffect, useRef, useState } from 'react';

import { Box, Divider, Scrollable, Text } from '@react-bulk/web';

import VirtualizedList from '@/components/VirtualizedList';
import { RobotoMonoFont } from '@/fonts';
import { Column } from '@/types/database.type';

export type TableResultsProps = {
  fields?: Column[];
  rows?: any[];
};

export default function TableResults({ fields, rows }: TableResultsProps) {
  const scrollViewRef = useRef<Element>();

  const [resultsSelected, setResultsSelected] = useState<any>();

  const handleCopyCell = useCallback(
    async (e: Event) => {
      const selection = window.getSelection()?.toString();

      if (!selection && resultsSelected) {
        e.preventDefault();

        const [rowIndex, fieldName] = resultsSelected.split('_');
        const text = getDisplayValue(rows?.[rowIndex]?.[fieldName]);
        await navigator.clipboard.writeText(text ?? 'NULL');
      }
    },
    [rows, resultsSelected],
  );

  useEffect(() => {
    addEventListener('copy', handleCopyCell);

    return () => {
      removeEventListener('copy', handleCopyCell);
    };
  }, [handleCopyCell]);

  const thStyle = {
    '&:first-child': { zIndex: 1 },
    bg: 'background.secondary',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    position: 'relative',
    textAlign: 'left',
    textTransform: 'none',
  };

  const cellStyle = {
    border: '1px solid text.disabled',
    p: 1,
  };

  const counterStyle = {
    b: 0,
    position: 'absolute',
    r: 0,
    t: 0,
  };

  const rowStyle = {
    '&:hover td': {
      bg: 'background.secondary',
    },
  };

  return (
    <Scrollable ref={scrollViewRef} style={{ overflow: 'auto' }}>
      <Box
        component="table"
        noRootStyles
        className={RobotoMonoFont.className}
        minw="100%"
        style={{ borderCollapse: 'collapse' }}
      >
        <Box component="thead" noRootStyles position="sticky" t="-1px">
          <tr>
            <Box component="th" noRootStyles l="-1px" position="sticky" pr={2} style={[thStyle, cellStyle]}>
              <Divider vertical opacity={1} style={counterStyle} />
            </Box>
            {fields?.map((column, columnIndex) => (
              <Box key={columnIndex} component="th" noRootStyles style={[thStyle, cellStyle]}>
                <Text fontSize="inherit" numberOfLines={1}>
                  {column.name}
                </Text>
                <Text color="text.secondary" fontSize=".75em" mt={0.5}>
                  ({column.type ?? '?'})
                </Text>
                <Divider b={0} l={0} opacity={1} position="absolute" r={0} />
              </Box>
            ))}
          </tr>
        </Box>
        <VirtualizedList component="tbody" rowFallbackComponent="tr" scrollViewRef={scrollViewRef}>
          {rows?.map((row, rowIndex) => (
            <Box key={rowIndex} component="tr" noRootStyles height={24} style={rowStyle}>
              <Box component="th" noRootStyles l="-1px" position="sticky" style={[thStyle, cellStyle]}>
                {rowIndex + 1}
                <Divider vertical opacity={1} style={counterStyle} />
              </Box>
              {fields?.map((column, columnIndex) => {
                const selectionKey = `${rowIndex}_${column.name}`;
                const isSelected = selectionKey === resultsSelected;
                const displayValue = getDisplayValue(row?.[column.name]);

                return (
                  <Box
                    key={columnIndex}
                    component="td"
                    noRootStyles
                    bg={isSelected ? 'primary.main.35' : undefined}
                    style={cellStyle}
                    onPress={() => setResultsSelected(selectionKey)}
                  >
                    <Text numberOfLines={1} variant="secondary">
                      {displayValue ?? (
                        <Text italic color="text.disabled">
                          NULL
                        </Text>
                      )}
                    </Text>
                  </Box>
                );
              })}
            </Box>
          ))}
        </VirtualizedList>
      </Box>
    </Scrollable>
  );
}

function getDisplayValue(value: Date | null | number | string | undefined) {
  if (value === null || typeof value === 'undefined') {
    return null;
  }

  if (value instanceof Date) {
    return value.toISOString().replace(/[TZ]/g, ' ').trim();
  }

  if (typeof value === 'object') {
    return JSON.stringify(value);
  }

  return `${value?.toString() ?? value ?? ''}`;
}
