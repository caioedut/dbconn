import React, { useRef, useState } from 'react';
import {
  Panel as ResizablePanel,
  PanelGroup as ResizablePanelGroup,
  PanelResizeHandle as ResizablePanelHandle,
} from 'react-resizable-panels';

import { useToaster } from '@react-bulk/core';
import { Box, Scrollable } from '@react-bulk/web';

import Panel from '@/components/Panel';
import QueryResults from '@/components/QueryResults';
import { RobotoMonoFont } from '@/fonts';
import { getError } from '@/helpers/api.helper';
import { t } from '@/helpers/translate.helper';
import useConnection from '@/hooks/useConnection';
import api from '@/services/api';

import { Result } from '../../types/database.type';

export type QueryEditorProps = {
  sql?: string;
};

export default function QueryEditor({ sql }: QueryEditorProps) {
  const toaster = useToaster();
  const { connection, database } = useConnection();

  const editorRef = useRef();

  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<Result[]>();

  const sendQuery = async (e: any) => {
    setIsLoading(true);
    setResults(undefined);

    const selection = window.getSelection();
    const text = selection?.toString() || e.target?.innerText || '';

    try {
      const response = await api.post('/query', connection?.id, text);
      setResults(response?.data);
    } catch (err) {
      toaster.error(getError(err));
    }

    setIsLoading(false);
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
            loading={isLoading}
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

        <ResizablePanelHandle style={{ height: 4 }} />

        {Boolean(results) && (
          <ResizablePanel collapsible>
            <Panel h="100%" title={t('Results')}>
              <QueryResults data={results} />
            </Panel>
          </ResizablePanel>
        )}
      </ResizablePanelGroup>
    </>
  );
}
