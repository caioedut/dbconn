import React, { useState } from 'react';

import { useTheme } from '@react-bulk/core';
import { Box, Divider, Scrollable, Text } from '@react-bulk/web';

import { RobotoMonoFont } from '@/fonts';

import { Result } from '../../types/database.type';

export type QueryResultsProps = {
  data?: Result[];
};

export default function QueryResults({ data }: QueryResultsProps) {
  const theme = useTheme();

  const [resultsSelected, setResultsSelected] = useState<any>();

  const thStyle = {
    '&:first-child': { zIndex: 1 },
    bg: 'background',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    position: 'relative',
    textAlign: 'left',
  };

  const cellStyle = {
    border: `1px solid ${theme.color('text.disabled')}`,
    padding: theme.spacing(1),
  };

  const counterStyle = {
    b: 0,
    position: 'absolute',
    r: 0,
    t: 0,
  };

  return (
    <>
      {(data || []).map(({ fields, rows }, index) => {
        return (
          <Scrollable key={index} mt={index ? 2 : 0} style={{ overflow: 'auto' }}>
            <Box
              component="table"
              noRootStyles
              className={RobotoMonoFont.className}
              minw="100%"
              style={{ borderCollapse: 'collapse' }}
            >
              <Box component="thead" noRootStyles bg="background" position="sticky" t={0}>
                <tr>
                  <Box component="th" noRootStyles l="-1px" position="sticky" pr={2} style={[thStyle, cellStyle]}>
                    #
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
                  <tr key={rowIndex}>
                    <Box component="th" noRootStyles l="-1px" position="sticky" style={[thStyle, cellStyle]}>
                      {rowIndex + 1}
                      <Divider vertical opacity={1} style={counterStyle} />
                    </Box>
                    {fields.map((field, fieldIndex) => {
                      const selectionKey = `${index}_${rowIndex}_${fieldIndex}`;
                      const isSelected = selectionKey === resultsSelected;

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
                            {row?.[field] instanceof Date
                              ? row?.[field].toISOString()
                              : row?.[field] ?? (
                                  <Text italic color="text.disabled">
                                    NULL
                                  </Text>
                                )}
                          </Text>
                        </Box>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </Box>
          </Scrollable>
        );
      })}
    </>
  );
}
