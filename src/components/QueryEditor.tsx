import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
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
import { t } from '@/helpers/translate.helper';
import useConnection from '@/hooks/useConnection';
import useTabs from '@/hooks/useTabs';
import api from '@/services/api';

import { Result } from '../../types/database.type';

export type QueryEditorProps = {
  autoRun?: boolean;
  sql?: string;
  tab: Tab;
};

function QueryEditor({ autoRun, sql, tab }: QueryEditorProps) {
  const toaster = useToaster();
  const connectionContext = useConnection();
  const { setConnection, setDatabase } = useTabs();

  // const { connection, database } = tab;

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
  const [results, setResults] = useState<Result[]>();

  const sendQuery = async () => {
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
  };

  useEffect(() => {
    setConnection(tab.id, connection);
    setDatabase(tab.id, database);
  }, [tab.id, connection, database, setConnection, setDatabase]);

  useEffect(() => {
    if (editorRef) {
      editorRef.current?.focus();

      if (autoRun) {
        sendQuery();
      }
    }
  }, [editorRef]);

  const handleKeyDown = (e: any) => {
    if (e.key === 'F5' || (e.key === 'Enter' && e.ctrlKey)) {
      sendQuery();
    }
  };

  return (
    <>
      <ResizablePanelGroup autoSaveId="example" direction="vertical">
        <ResizablePanel collapsible>
          <Panel
            h="100%"
            loading={isLoading}
            // title={t('Query')}
          >
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
              >
                {sql ?? ''}
              </Box>
            </Scrollable>
          </Panel>
        </ResizablePanel>

        {Boolean(results) && (
          <>
            <ResizablePanelHandle style={{ height: 4 }} />

            <ResizablePanel collapsible>
              <Panel h="100%" title={t('Results')}>
                <QueryResults data={results} />
              </Panel>
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </>
  );
}

export default memo(QueryEditor);
