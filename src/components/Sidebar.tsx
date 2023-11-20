import { Box, Button, Scrollable } from '@react-bulk/web';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useSelectedLayoutSegment } from 'next/navigation';

import Icon from '@/components/Icon';
import { t } from '@/helpers/translate.helper';
import useHotkey from '@/hooks/useHotkey';

export default function Sidebar() {
  const router = useRouter();
  const segment = useSelectedLayoutSegment();

  const links = [
    {
      name: `${t('Connections')} (F1)`,
      icon: 'Database',
      url: '/',
    },
    {
      name: `${t('Settings')} (Alt+S)`,
      icon: 'Settings',
      style: { mt: 'auto' },
      url: '/settings',
    },
  ];

  links.forEach(({ url }, index) => {
    useHotkey({
      callback: () => router.push(url),
      key: `F${index + 1}`,
    });
  });

  useHotkey({
    alt: true,
    callback: () => router.push('/settings'),
    key: `s`,
  });

  return (
    <Scrollable contentInset={1}>
      {links.map((link, index) => {
        const isSelected = `/${segment ?? ''}` === link.url;

        return (
          <Box key={index} style={link.style}>
            <Button
              component={NextLink}
              color="primary"
              href={link.url}
              mb={1}
              p={0}
              size="large"
              title={link.name}
              variant={isSelected ? 'solid' : 'text'}
            >
              <Icon color={isSelected ? 'contrast' : 'text'} name={link.icon} size="1.5rem" />
            </Button>
          </Box>
        );
      })}
    </Scrollable>
  );
}
