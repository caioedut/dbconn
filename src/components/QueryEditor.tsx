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
import { RobotoMonoFont } from '@/fonts';
import { getError } from '@/helpers/api.helper';
import { restoreSelection, saveSelection } from '@/helpers/selection.helper';
import useConnection from '@/hooks/useConnection';
import useTabs from '@/hooks/useTabs';
import api from '@/services/api';
import { Connection, Database, QueryError, Result } from '@/types/database.type';

export type QueryEditorProps = {
  autoRun?: boolean;
  sql?: string;
  tabId: string;
};

const parseHTML = (text: string) => {
  return highlight(text, { html: true }).replace(/\n/g, '<br>');
};

function QueryEditor({ autoRun, sql, tabId }: QueryEditorProps) {
  const toaster = useToaster();
  const connectionContext = useConnection();
  const { setTitle } = useTabs();

  const [connection, setConnection] = useState<Connection | undefined>(connectionContext.connection);
  const [database, setDatabase] = useState<Database | undefined>(connectionContext.database);

  // const connection = useMemo(
  //   () => tab?.connection ?? connectionContext.connection,
  //   [tab?.connection, connectionContext.connection],
  // );
  //
  // const database = useMemo(
  //   () => tab?.database ?? connectionContext.database,
  //   [tab?.database, connectionContext.database],
  // );

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
  }, [connection?.id, toaster]);

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
    const $editor = editorRef.current as HTMLDivElement;
    const selection = saveSelection($editor);
    editorRef.current!.innerHTML = parseHTML($editor.innerText);
    restoreSelection($editor, selection);
  }, []);

  useEffect(() => {
    if (!connection) {
      setConnection(connectionContext.connection);
    }
  }, [connectionContext.connection, connection]);

  useEffect(() => {
    if (!database) {
      setDatabase(connectionContext.database);
    }
  }, [connectionContext.database, database]);

  useEffect(() => {
    const title = `${(connection?.name || connection?.host) ?? '-----'} /// ${database?.name ?? '-----'} /// ${
      connection?.user ?? '-----'
    }`;

    setTitle(tabId, title);
  }, [tabId, setTitle, connection, database]);

  useEffect(() => {
    if (editorRef) {
      editorRef.current?.focus();

      if (autoRun) {
        sendQuery();
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                dangerouslySetInnerHTML={{ __html: parseHTML(sql ?? '') }}
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
