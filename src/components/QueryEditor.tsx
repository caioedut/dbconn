import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Panel as ResizablePanel,
  PanelGroup as ResizablePanelGroup,
  PanelResizeHandle as ResizablePanelHandle,
} from 'react-resizable-panels';

import { useToaster } from '@react-bulk/core';
import { Box, Scrollable } from '@react-bulk/web';

import Panel from '@/components/Panel';
import QueryResults from '@/components/QueryResults';
import { Tab } from '@/contexts/TabsContext';
import { RobotoMonoFont } from '@/fonts';
import { getError } from '@/helpers/api.helper';
import useConnection from '@/hooks/useConnection';
import useTabs from '@/hooks/useTabs';
import api from '@/services/api';
import { QueryError, Result } from '@/types/database.type';

export type QueryEditorProps = {
  autoRun?: boolean;
  sql?: string;
  tab: Tab;
};

function QueryEditor({ autoRun, sql, tab }: QueryEditorProps) {
  const toaster = useToaster();
  const connectionContext = useConnection();
  const { setConnection, setDatabase } = useTabs();

  const connection = useMemo(
    () => tab?.connection ?? connectionContext.connection,
    [tab?.connection, connectionContext.connection],
  );

  const database = useMemo(
    () => tab?.database ?? connectionContext.database,
    [tab?.database, connectionContext.database],
  );

  const editorRef = useRef<HTMLDivElement>();

  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<(QueryError | Result)[]>();

  const sendQuery = useCallback(async () => {
    setIsLoading(true);
    setResults(undefined);

    const selection = window.getSelection();
    const text = selection?.toString() || editorRef.current?.innerText || '';

    try {
      const response = await api.post('/query', connection?.id, text);
      console.log('res', response);
      setResults(response?.data);
    } catch (err) {
      console.log('err', err);
      toaster.error(getError(err));
    }

    setIsLoading(false);
  }, [connection?.id]);

  const handleKeyDown = useCallback(
    (e: any) => {
      if (e.key === 'F5' || (e.key === 'Enter' && e.ctrlKey)) {
        sendQuery().catch(() => null);
      }
    },
    [sendQuery],
  );

  const handlePaste = useCallback((e: ClipboardEvent) => {
    e.preventDefault();
    document.execCommand('inserttext', false, e.clipboardData?.getData('text/plain') ?? '');
  }, []);

  useEffect(() => {
    setConnection(tab.id, connection);
  }, [tab.id, connection, setConnection]);

  useEffect(() => {
    setDatabase(tab.id, database);
  }, [tab.id, database, setDatabase]);

  useEffect(() => {
    if (editorRef) {
      editorRef.current?.focus();

      if (autoRun) {
        sendQuery();
      }
    }
  }, [editorRef]);

  return (
    <>
      <ResizablePanelGroup autoSaveId="example" direction="vertical">
        <ResizablePanel minSizePixels={32} order={1}>
          <Panel h="100%" loading={isLoading}>
            <Scrollable>
              <Box
                ref={editorRef}
                contentEditable
                noRootStyles
                suppressContentEditableWarning
                autoCapitalize="none"
                autoCorrect="off"
                className={RobotoMonoFont.className}
                h="100%"
                p={2}
                spellCheck={false}
                style={{
                  letterSpacing: 0.5,
                  lineHeight: 1.35,
                  outline: 'none !important',
                }}
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
              >
                {sql ?? ''}
              </Box>
            </Scrollable>
          </Panel>
        </ResizablePanel>

        {Boolean(results) && (
          <>
            <ResizablePanelHandle style={{ height: 4 }} />

            <ResizablePanel minSizePixels={32} order={2}>
              <QueryResults data={results} />
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </>
  );
}

export default memo(QueryEditor);
