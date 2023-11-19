import React, { Fragment, memo, useCallback, useEffect, useState } from 'react';

import { Box, Divider, Scrollable, Text } from '@react-bulk/web';

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
    <>
      {(data || []).map((result, index) => {
        if ('error' in result) {
          return (
            <Box key={index} border="1px solid error" mb={0} mt={index ? 2 : 0}>
              <Text bg="error" letterSpacing={1} p={1} variant="caption">
                {t('Result')} #{index + 1} | ERROR {result.code} ({result.state})
              </Text>
              <Text p={1}>{result.message}</Text>
            </Box>
          );
        }

        const { fields, rows } = result;

        return (
          <Scrollable key={index} mt={index ? 2 : 0} style={{ overflow: 'auto' }}>
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
                  {fields.map((field, fieldIndex) => (
                    <Box key={fieldIndex} component="th" noRootStyles style={[thStyle, cellStyle]}>
                      {field}
                    </Box>
                  ))}
                </tr>
              </Box>
              <tbody>
                {rows.map((row, rowIndex) => (
                  <Box key={rowIndex} component="tr" noRootStyles style={rowStyle}>
                    <Box component="th" noRootStyles l="-1px" position="sticky" style={[thStyle, cellStyle]}>
                      {rowIndex + 1}
                      <Divider vertical opacity={1} style={counterStyle} />
                    </Box>
                    {fields.map((field, fieldIndex) => {
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
    </>
  );
}

export default memo(QueryResults);
