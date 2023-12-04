import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import {
  Panel as ResizablePanel,
  PanelGroup as ResizablePanelGroup,
  PanelResizeHandle as ResizablePanelHandle,
} from 'react-resizable-panels';

import { sleep, useToaster } from '@react-bulk/core';
import { Box, Card, Scrollable, Text } from '@react-bulk/web';
import { offset } from 'caret-pos';
import { highlight } from 'sql-highlight';

import Overable from '@/components/Overable';
import Panel from '@/components/Panel';
import QueryResults from '@/components/QueryResults';
import VirtualizedList from '@/components/VirtualizedList';
import { CONTEXT, PRIMARY } from '@/constants/SQL';
import { RobotoMonoFont } from '@/fonts';
import { getError } from '@/helpers/api.helper';
import { insertAtSelection } from '@/helpers/selection.helper';
import { t } from '@/helpers/translate.helper';
import useCurrentTab from '@/hooks/useCurrentTab';
import useTableList from '@/hooks/useTableList';
import api from '@/services/api';
import { QueryError, Result } from '@/types/database.type';

export type QueryEditorProps = {
  autoRun?: boolean;
  sql?: string;
};

const parseHTML = (text: string) => {
  return highlight(text, { html: true }).replace(/\n/g, '<br>');
};

const sqlToAst = (sql: string) => {
  const froms: { alias: null | string; table: string }[] = [];

  const regex = new RegExp(PRIMARY.join('|') + '\b', 'ig');
  const splitted = sql
    .replace(regex, (substr) => `$///$${substr}`.toUpperCase().trim())
    .split('$///$')
    .filter(Boolean);

  for (const cmd of splitted) {
    if (cmd.startsWith('FROM')) {
      froms.push(
        ...cmd
          .replace('FROM', '')
          .split(',')
          .filter((item) => item.trim())
          .map((item) => {
            const matches = item.trim().matchAll(/(\S+)(\sAS\s)?(\w+)?/gi);
            const match = matches?.next();

            const table = match?.value?.[1] ?? null;
            const alias = match?.value?.[3] ?? null;

            return { alias, table };
          }),
      );
    }
  }

  const type = (sql.trim().split(/\s/).at(0) || 'UNKNOWN').toUpperCase();

  return { froms, type };
};

function QueryEditor({ autoRun, sql = '' }: QueryEditorProps) {
  const toaster = useToaster();

  const { connection, database, setFooter } = useCurrentTab();

  const { data: tables, getColumns } = useTableList(connection, database);

  const acScrollRef = useRef<Element>();
  const acSelectedRef = useRef<HTMLDivElement>();
  const [acIndex, setAcIndex] = useState(-1);
  const [acItems, setAcItems] = useState<string[] | string[][]>([]);
  const [acPositions, setAcPositions] = useState<{ left: number; top: number } | null>(null);

  const editorRef = useRef<HTMLDivElement>();

  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<(QueryError | Result)[]>();

  const sendQuery = useCallback(async () => {
    setIsLoading(true);
    setResults(undefined);

    const selection = window.getSelection();
    const text = (selection?.toString() || editorRef.current?.innerText || '').trim();

    if (text) {
      try {
        const response = await api.post('/query', connection?.id, text);
        setResults(response?.data);
      } catch (err) {
        toaster.error(getError(err));
      }
    }

    setIsLoading(false);
  }, [connection?.id, toaster]);

  const showAutocomplete = useCallback(() => {
    const { height, left, top } = offset(editorRef.current as Element);

    setAcPositions({ left, top: top + height });

    acSelectedRef?.current?.scrollIntoView({
      block: 'nearest',
      inline: 'nearest',
    });
  }, []);

  const closeAutocomplete = useCallback((force = true) => {
    if (force) {
      setAcIndex(-1);
      setAcItems([]);
    }

    setAcPositions(null);
  }, []);

  const autocomplete = useCallback(async () => {
    await sleep(10);

    closeAutocomplete(false);

    const selection = document.getSelection() as Selection;
    const range = document.createRange();

    if (document.activeElement !== editorRef.current || selection.toString()) {
      return;
    }

    let caretPosition = 0;

    if (range.collapsed) {
      const temp = document.createTextNode('\0');
      selection.getRangeAt(0).insertNode(temp);
      caretPosition = editorRef.current!.innerText.indexOf('\0');
      temp.parentNode!.removeChild(temp);

      range.setStart(selection.focusNode!, selection.focusOffset!);
      range.collapse(false);

      // e.key === 'Enter'
      // selection.removeAllRanges();
      // selection.addRange(range);
    }

    const text = selection.focusNode?.textContent ?? '';
    const ast = sqlToAst(text);

    const splitted = text.substring(0, caretPosition).split(/\s/g);
    // .filter((cmd: string) => cmd.trim());

    const keyword =
      splitted
        .filter((cmd: string) => Object.keys(CONTEXT).includes(cmd.toUpperCase().trim()))
        .at(-1)
        ?.toUpperCase() ?? '';

    const context = splitted.at(-1) ?? '';

    console.log({ context, keyword });

    let newItems: any[] = [];

    if (connection && database) {
      if (!keyword) {
        newItems = [...PRIMARY];
      } else {
        newItems = [...(CONTEXT?.[keyword as keyof typeof CONTEXT] ?? [])];
      }

      if (newItems.includes('$tables')) {
        const withAlias = (tables || []).map(({ fullName }) => fullName);
        const withoutAlias = (tables || []).map(({ name }) => name);
        const listTables = [...withAlias, ...(!context ? [] : withoutAlias)];
        newItems.splice(newItems.indexOf('$tables'), 1, ...listTables);
      }

      if (newItems.includes('$fields')) {
        const columns: string[] = [];

        // Store Fields
        for (const from of ast.froms) {
          try {
            const data = await getColumns(from.table);

            const withAlias = data.map((item) => [from.alias ?? from.table, item.name].filter(Boolean).join('.'));
            const withoutAlias = data.map((item) => [item.name].filter(Boolean).join('.'));

            columns.push(...withAlias, ...(!context ? [] : withoutAlias));
          } catch {}
        }

        newItems.splice(newItems.indexOf('$fields'), 1, ...columns);
      }

      newItems = newItems
        .filter((item) => item.toUpperCase().startsWith(context.toUpperCase()))
        .map((item: string) => [item.substring(context.length), item]);
    }

    if (newItems?.length) {
      showAutocomplete();
    }

    setAcItems(newItems);
  }, [closeAutocomplete, connection, database, getColumns, showAutocomplete, tables]);

  const handleKeyDown = useCallback(
    (e: any) => {
      const { altKey, code, ctrlKey, key, metaKey, shiftKey } = e;

      const isModifierPressed = ctrlKey | altKey | metaKey | shiftKey;

      let prevent = false;

      if (key === 'F5' || (key === 'Enter' && ctrlKey)) {
        prevent = true;
        sendQuery().catch(() => null);
      }

      if (code === 'Space' && ctrlKey) {
        prevent = true;
      }

      if (key === 'Tab' && !isModifierPressed) {
        prevent = true;
        insertAtSelection(editorRef.current, `  `);
      }

      // Autocomplete
      if (acPositions && acItems.length) {
        if (key === 'Escape') {
          prevent = true;
          closeAutocomplete();
        }

        if (key === 'Enter') {
          const acItem = acItems[acIndex];

          if (typeof acItem !== 'undefined') {
            prevent = true;

            const textToInsert = Array.isArray(acItem) ? acItem[0] : acItem;
            insertAtSelection(editorRef.current, `${textToInsert} `);
            closeAutocomplete();
          }
        }

        let inc = 0;

        if (key === 'ArrowUp') {
          prevent = true;
          inc = -1;
        }

        if (key === 'ArrowDown') {
          prevent = true;
          inc = 1;
        }

        if (inc) {
          setAcIndex((current) => {
            let newIndex = current + inc;

            if (newIndex < 0) {
              newIndex = -1;
            }

            if (newIndex >= acItems.length) {
              newIndex = acItems.length - 1;
            }

            return newIndex;
          });
        }
      }

      if ((!acPositions || !acItems.length) && ['ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowUp'].includes(key)) {
        // Do nothing
      } else if (key !== 'Escape') {
        autocomplete().catch(() => null);
      }

      if (prevent) {
        e.preventDefault();
      }
    },
    [acIndex, acItems, acPositions, autocomplete, closeAutocomplete, sendQuery],
  );

  const handlePaste = useCallback((e: ClipboardEvent) => {
    e.preventDefault();
    document.execCommand('inserttext', false, e.clipboardData?.getData('text/plain') ?? '');
  }, []);

  const handleChange = useCallback(async () => {
    // const $editor = editorRef.current as HTMLDivElement;
    // const selection = saveSelection($editor);
    // // TODO: highlight
    // editorRef.current!.innerHTML = parseHTML($editor.innerText);
    // restoreSelection($editor, selection);
  }, []);

  useEffect(() => {
    if (!editorRef.current) return;

    // TODO: highlight
    // editorRef.current.innerHTML = parseHTML(sql ?? '');
    editorRef.current.innerHTML = sql ?? '';

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorRef]);

  useEffect(() => {
    if (editorRef) {
      editorRef.current?.focus();

      if (autoRun) {
        sendQuery().catch(() => null);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorRef]);

  useEffect(() => {
    if (results) {
      setFooter([`${results?.length} ${t('row(s)')}`]);
    }
  }, [results, setFooter]);

  return (
    <>
      <ResizablePanelGroup direction="vertical">
        <ResizablePanel minSizePixels={32} order={1}>
          <Panel h="100%" loading={isLoading} position="relative">
            <Scrollable>
              <Box
                ref={editorRef}
                component="pre"
                contentEditable
                noRootStyles
                suppressContentEditableWarning
                autoCapitalize="none"
                autoCorrect="off"
                className={RobotoMonoFont.className}
                // dangerouslySetInnerHTML={{ __html: parseHTML(sql ?? '') }}
                h="100%"
                m={0}
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
                onBlur={() => closeAutocomplete()}
                onInput={handleChange}
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
              />
            </Scrollable>

            {Boolean(acPositions && acItems.length) && (
              <Card
                bg="background.secondary"
                border="1px solid primary"
                p={0}
                position="fixed"
                shadow={2}
                {...(acPositions ?? {})}
              >
                <Scrollable ref={acScrollRef} maxh={140} w={240}>
                  <VirtualizedList rowHeight={22} scrollViewRef={acScrollRef}>
                    {acItems?.map((item, index) => (
                      <Overable
                        key={index}
                        ref={index === acIndex ? acSelectedRef : null}
                        active={index === acIndex}
                        p={1}
                      >
                        <Text variant="secondary">{Array.isArray(item) ? item[1] : item}</Text>
                      </Overable>
                    ))}
                  </VirtualizedList>
                </Scrollable>

                {(!connection || !database) && (
                  <Text bg="warning" letterSpacing={1} p={1} variant="caption">
                    Pick database for best results!
                  </Text>
                )}
              </Card>
            )}
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
