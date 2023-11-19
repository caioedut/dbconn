import React, { useRef, useState } from 'react';
import {
  Panel as ResizablePanel,
  PanelGroup as ResizablePanelGroup,
  PanelResizeHandle as ResizablePanelHandle,
} from 'react-resizable-panels';

import { useToaster } from '@react-bulk/core';
import { Box, Divider, Scrollable, Text } from '@react-bulk/web';
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
  const toaster = useToaster();
  const { connection, database } = useConnection();

  const editorRef = useRef();

  const [results, setResults] = useState<Result[]>();

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
            <Box
              ref={editorRef}
              contentEditable
              noRootStyles
              autoCapitalize="none"
              autoCorrect="off"
              className={font.className}
              h="100%"
              m={-2}
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
          </Panel>
        </ResizablePanel>

        <ResizablePanelHandle style={{ height: 4 }} />

        <ResizablePanel collapsible>
          <Panel h="100%" title={t('Results')}>
            <Box m={-2}>
              {results?.map(({ fields, rows }, index) => (
                <>
                  {index > 0 && <Divider my={1} />}

                  <Scrollable direction="horizontal">
                    <table>
                      <thead>
                        <tr>
                          {fields.map((field, fieldIndex) => (
                            <th key={fieldIndex}>{field}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map((row, rowIndex) => (
                          <tr key={rowIndex}>
                            {fields.map((field, fieldIndex) => (
                              <td key={fieldIndex}>
                                <Text numberOfLines={1}>
                                  {row?.[field] instanceof Date ? row?.[field].toISOString() : row?.[field] ?? 'null'}
                                </Text>
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </Scrollable>
                </>
              ))}
            </Box>
          </Panel>
        </ResizablePanel>
      </ResizablePanelGroup>
    </>
  );
}
