import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Panel as ResizablePanel,
  PanelGroup as ResizablePanelGroup,
  PanelResizeHandle as ResizablePanelHandle,
} from 'react-resizable-panels';

import { useToaster } from '@react-bulk/core';
import { Box, Scrollable } from '@react-bulk/web';
import { highlight } from 'sql-highlight';

import Panel from '@/components/Panel';
import QueryResults from '@/components/QueryResults';
import { Tab } from '@/contexts/TabsContext';
import { RobotoMonoFont } from '@/fonts';
import { getError } from '@/helpers/api.helper';
import { restoreSelection, saveSelection } from '@/helpers/selection.helper';
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
      setResults(response?.data);
    } catch (err) {
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

  const handleChange = useCallback(() => {
    const $editor = editorRef.current as Element;
    const selection = saveSelection($editor);
    editorRef.current!.innerHTML = highlight($editor.textContent ?? '', { html: true });
    restoreSelection($editor, selection);
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
                dangerouslySetInnerHTML={{ __html: highlight(sql ?? '', { html: true }) }}
                h="100%"
                p={2}
                spellCheck={false}
                style={{
                  '& .sql-hl-bracket': { color: 'editor.bracket' },
                  '& .sql-hl-comment': { color: 'editor.comment', fontWeight: 400 },
                  '& .sql-hl-function': { color: 'editor.function' },
                  '& .sql-hl-keyword': { color: 'editor.keyword' },
                  '& .sql-hl-number': { color: 'editor.number' },
                  '& .sql-hl-special': { color: 'editor.special' },
                  '& .sql-hl-string': { color: 'editor.string' },

                  fontWeight: 500,
                  letterSpacing: 1,
                  lineHeight: 1.35,
                  outline: 'none !important',
                }}
                onInput={handleChange}
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
              />
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
