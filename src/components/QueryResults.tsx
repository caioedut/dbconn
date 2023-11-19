import React, { memo, useCallback, useEffect, useState } from 'react';

import { Box, Divider, Scrollable, Tabs, Text } from '@react-bulk/web';

import Panel from '@/components/Panel';
import { RobotoMonoFont } from '@/fonts';
import { t } from '@/helpers/translate.helper';

import { QueryError, Result } from '../../types/database.type';

export type QueryResultsProps = {
  data?: (QueryError | Result)[];
};

const getDisplayValue = (value: Date | null | number | string | undefined) => {
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
};

function QueryResults({ data }: QueryResultsProps) {
  const [tab, setTab] = useState(0);

  const [resultsSelected, setResultsSelected] = useState<any>();

  const thStyle = {
    '&:first-child': { zIndex: 1 },
    bg: 'background.secondary',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    position: 'relative',
    textAlign: 'left',
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

  const handleCopyCell = useCallback(
    async (e: Event) => {
      const selection = window.getSelection()?.toString();

      if (!selection && resultsSelected) {
        e.preventDefault();

        const [resultIndex, rowIndex, field] = resultsSelected.split('_');
        const result = data?.[resultIndex];

        if (result && !('error' in result)) {
          const text = getDisplayValue(result.rows?.[rowIndex]?.[field]);
          await navigator.clipboard.writeText(text ?? 'NULL');
        }
      }
    },
    [data, resultsSelected],
  );

  useEffect(() => {
    addEventListener('copy', handleCopyCell);

    return () => {
      removeEventListener('copy', handleCopyCell);
    };
  }, [handleCopyCell]);

  return (
    <Box h="100%">
      <Box h={36} mb={-1} p={1} pb={0}>
        <Tabs
          tabs={(data || []).map((_, index) => ({
            label: `${t('Result')} #${index + 1}`,
          }))}
          value={tab}
          onChange={(_, value) => setTab(value as number)}
        />
      </Box>

      <Panel h="calc(100% - 36px)">
        {(data || []).map((result, index) => {
          return 'error' in result ? (
            <Box key={index} border="1px solid error" hidden={index !== tab} m={2}>
              <Text bg="error" letterSpacing={1} p={2} variant="caption">
                ERROR {result.code} ({result.state})
              </Text>
              <Text p={2}>{result.message}</Text>
            </Box>
          ) : (
            <Scrollable key={index} hidden={index !== tab} style={{ overflow: 'auto' }}>
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
                    {result.fields.map((field, fieldIndex) => (
                      <Box key={fieldIndex} component="th" noRootStyles style={[thStyle, cellStyle]}>
                        {field}
                      </Box>
                    ))}
                  </tr>
                </Box>
                <tbody>
                  {result.rows.map((row, rowIndex) => (
                    <Box key={rowIndex} component="tr" noRootStyles style={rowStyle}>
                      <Box component="th" noRootStyles l="-1px" position="sticky" style={[thStyle, cellStyle]}>
                        {rowIndex + 1}
                        <Divider vertical opacity={1} style={counterStyle} />
                      </Box>
                      {result.fields.map((field, fieldIndex) => {
                        const selectionKey = `${index}_${rowIndex}_${field}`;
                        const isSelected = selectionKey === resultsSelected;
                        const displayValue = getDisplayValue(row?.[field]);

                        return (
                          <Box
                            key={fieldIndex}
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
                </tbody>
              </Box>
            </Scrollable>
          );
        })}
      </Panel>
    </Box>
  );
}

export default memo(QueryResults);
