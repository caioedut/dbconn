'use client';

import { useTheme } from '@react-bulk/core';
import { Box, Grid, Scrollable } from '@react-bulk/web';

import List from '@/components/List';
import Panel from '@/components/Panel';
import { t } from '@/helpers/translate.helper';
import useAppearance, { themes } from '@/hooks/useAppearance';
import useSettings from '@/hooks/useSettings';

// const languages = [
//   { label: 'Inglês', value: 'en' },
//   { label: 'Português (BR)', value: 'pt-BR' },
// ];

export default function Page() {
  const settings = useSettings();
  const { setThemeId } = useAppearance();
  const { custom } = useTheme();

  return (
    <>
      <Scrollable hidden={settings.section !== 'appearance'}>
        <Grid gap={1}>
          {/*<Box lg={3} md={6} xs={12}>*/}
          {/*  <Panel flex title={t('Idioma')}>*/}
          {/*    <Scrollable h={160}>*/}
          {/*      <List*/}
          {/*        items={languages.map((lang) => ({*/}
          {/*          label: lang.label,*/}
          {/*          endIcon: lang.value === settings.language ? 'Check' : undefined,*/}
          {/*          onPress: () => settings.setLanguage(lang.value),*/}
          {/*        }))}*/}
          {/*      />*/}
          {/*    </Scrollable>*/}
          {/*  </Panel>*/}
          {/*</Box>*/}
          <Box lg={3} md={6} xs={12}>
            <Panel flex title={t('Theme')}>
              <Scrollable h={160}>
                <List
                  items={Object.values(themes).map((theme) => ({
                    label: theme.custom?.name,
                    endIcon: custom.id === theme.custom?.id ? 'Check' : undefined,
                    onPress: () => setThemeId(theme.custom?.id),
                  }))}
                />
              </Scrollable>
            </Panel>
          </Box>
        </Grid>
      </Scrollable>
    </>
  );
}
