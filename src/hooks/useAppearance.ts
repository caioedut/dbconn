import { useCallback, useMemo } from 'react';
import { useStoreState } from 'react-state-hooks';

import { getCookie, setCookie } from '@/services/cookies';

import dark from '../../main/themes/dark';
import light from '../../main/themes/light';

export const themes = {
  dark,
  light,
};

export default function useAppearance() {
  const themeIdKey = 'appearance.themeId';

  // @ts-expect-error
  const [themeId, _setThemeId] = useStoreState<keyof typeof themes>(themeIdKey, getCookie(themeIdKey) || 'dark');

  const setThemeId = useCallback((themeId: keyof typeof themes) => {
    _setThemeId(themeId);
    setCookie(themeIdKey, themeId);
  }, []);

  const theme = useMemo(() => themes[themeId], [themeId]);

  return { setThemeId, theme, themeId };
}
