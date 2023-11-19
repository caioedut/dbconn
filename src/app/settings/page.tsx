'use client';

import { ThemeProps, useTheme } from '@react-bulk/core';
import { Box, Button, ButtonGroup, Grid, Scrollable } from '@react-bulk/web';

import Panel from '@/components/Panel';
import { t } from '@/helpers/translate.helper';

import dark from '../../../main/themes/dark';
import light from '../../../main/themes/light';

export default function Page() {
  const { custom, setTheme } = useTheme();

  const themes = [
    { name: 'Light', theme: light },
    { name: 'Dark', theme: dark },
  ];

  return (
    <>
      <Scrollable contentInset={2}>
        <Grid>
          <Box lg={3} md={6} xs={12}>
            <Panel flex title={t('Theme')}>
              <Box p={2}>
                <ButtonGroup>
                  {themes.map((theme, index) => (
                    <Button
                      key={index}
                      variant={custom.id === theme.theme?.custom?.id ? 'solid' : 'outline'}
                      onPress={() => setTheme(theme.theme as ThemeProps)}
                    >
                      {theme.name}
                    </Button>
                  ))}
                </ButtonGroup>
              </Box>
            </Panel>
          </Box>
        </Grid>
      </Scrollable>
    </>
  );
}
