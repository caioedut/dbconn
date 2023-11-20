import { memo } from 'react';

import { Box } from '@react-bulk/web';

import List from '@/components/List';
import { t } from '@/helpers/translate.helper';
import useSettings from '@/hooks/useSettings';

function SettingsDrawer() {
  const settings = useSettings();

  const sections = [
    {
      label: t('Appearance'),
      icon: 'PenTool',
      section: 'appearance',
    },
    {
      label: t('Shortcuts'),
      icon: 'Command',
      section: 'shortcuts',
    },
  ];

  return (
    <>
      <List
        flex
        gap={4}
        items={sections.map(({ icon, section, ...rest }) => {
          const isSelected = section === settings.section;

          return {
            ...rest,
            fontWeight: 'bold',
            icon: { name: icon, mr: 2, size: 20 },
            onPress: () => settings.setSection(section),
            selected: isSelected,
          };
        })}
        p={0}
      />
    </>
  );
}

export default memo(SettingsDrawer);
