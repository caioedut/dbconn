import React, { useRef, useState } from 'react';
import {
  Panel as ResizablePanel,
  PanelGroup as ResizablePanelGroup,
  PanelResizeHandle as ResizablePanelHandle,
} from 'react-resizable-panels';

import { useTheme, useToaster } from '@react-bulk/core';
import { Box, Scrollable, Text } from '@react-bulk/web';
import { Roboto_Mono } from 'next/font/google';

import Panel from '@/components/Panel';
import { getError } from '@/helpers/api.helper';
import { t } from '@/helpers/translate.helper';
import useConnection from '@/hooks/useConnection';
import api from '@/services/api';

import { Result } from '../../types/database.type';

const font = Roboto_Mono({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700'],
});

export default function QueryEditor() {
  const theme = useTheme();
  const toaster = useToaster();
  const { connection, database } = useConnection();

  const editorRef = useRef();

  const [results, setResults] = useState<Result[]>();
  const [resultsSelected, setResultsSelected] = useState<any>();

  const sendQuery = async (e: any) => {
    const selection = window.getSelection();
    const text = selection?.toString() || e.target?.innerText || '';

    setResults(undefined);

    try {
      const response = await api.post('/query', connection?.id, text);
      setResults(response?.data);
    } catch (err) {
      toaster.error(getError(err));
    }
  };

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      sendQuery(e);
    }
  };

  const thStyle = {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'left',
  };

  const cellStyle = {
    border: `1px solid ${theme.color('text.disabled')}`,
    padding: theme.spacing(1),
  };

  return (
    <>
      <ResizablePanelGroup autoSaveId="example" direction="vertical">
        <ResizablePanel collapsible>
          <Panel
            h="100%"
            title={`${t('Query')}${connection ? `: ${connection?.name || connection?.host}` : ''}${
              database ? ` / ${database?.name}` : ''
            }`}
          >
            <Scrollable>
              <Box
                ref={editorRef}
                contentEditable
                noRootStyles
                suppressContentEditableWarning
                autoCapitalize="none"
                autoCorrect="off"
                className={font.className}
                h="100%"
                p={2}
                spellCheck={false}
                style={{
                  letterSpacing: 0.5,
                  lineHeight: 1.35,
                  outline: 'none !important',
                }}
                onKeyDown={handleKeyDown}
              >
                SELECT * FROM user
              </Box>
            </Scrollable>
          </Panel>
        </ResizablePanel>

        <ResizablePanelHandle style={{ height: 4 }} />

        <ResizablePanel collapsible>
          <Panel h="100%" title={t('Results')}>
            {results?.map(({ fields, rows }, index) => (
              <Scrollable key={index} mb={2} style={{ overflow: 'auto' }}>
                <Box component="table" noRootStyles minw="100%" style={{ borderCollapse: 'collapse' }}>
                  <Box component="thead" noRootStyles bg="background" position="sticky" t={0}>
                    <tr>
                      <Box component="th" noRootStyles style={[thStyle, cellStyle]}>
                        #
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
                        <Box component="th" noRootStyles style={[thStyle, cellStyle]}>
                          {rowIndex + 1}
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
            ))}
          </Panel>
        </ResizablePanel>
      </ResizablePanelGroup>
    </>
  );
}
