import React, { memo, useState } from 'react';

import { useTheme } from '@react-bulk/core';
import { Box, Tabs, Text } from '@react-bulk/web';

import Panel from '@/components/Panel';
import TableResults from '@/components/TableResults';
import { t } from '@/helpers/translate.helper';
import { QueryError, Result } from '@/types/database.type';

export type QueryResultsProps = {
  data?: (QueryError | Result)[];
};

function QueryResults({ data }: QueryResultsProps) {
  const theme = useTheme();

  const [tab, setTab] = useState(0);

  return (
    <Box h="100%">
      <Box h={36} mb={-1} p={1} pb={0}>
        <Tabs
          tabs={(data || []).map((result, index) => ({
            label: (
              <>
                <Text bold color={theme.contrast('primary')} letterSpacing={1} variant="caption">
                  {t('RESULT')} #{index + 1}
                </Text>
                <Text right color={theme.contrast('primary')} variant="caption">
                  {'error' in result ? t('ERROR') : `${result.rows.length} ${t('rows')}`}
                </Text>
              </>
            ) as any,
          }))}
          value={tab}
          onChange={(_, value) => setTab(value as number)}
        />
      </Box>

      <Panel h="calc(100% - 36px)">
        {(data || []).map((result, index) => (
          <Box key={index} h="100%" hidden={index !== tab}>
            {'error' in result ? (
              <Box border="1px solid error" hidden={index !== tab} m={2}>
                <Text bg="error" letterSpacing={1} p={2} variant="caption">
                  ERROR {result.code} ({result.state})
                </Text>
                <Text p={2}>{result.message}</Text>
              </Box>
            ) : (
              <TableResults fields={result.fields} rows={result.rows} />
            )}
          </Box>
        ))}
      </Panel>
    </Box>
  );
}

export default memo(QueryResults);
