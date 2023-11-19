import { Box, Button, Scrollable } from '@react-bulk/web';
import NextLink from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';

import Icon from '@/components/Icon';
import { t } from '@/helpers/translate.helper';

export default function Sidebar() {
  const segment = useSelectedLayoutSegment();

  const links = [
    {
      name: 'Database',
      icon: 'Database',
      url: '/',
    },
    {
      name: 'Queries',
      icon: 'Code',
      url: '/first',
    },
    {
      name: 'Settings',
      icon: 'Settings',
      style: { mt: 'auto' },
      url: '/settings',
    },
  ];

  return (
    <Scrollable contentInset={1}>
      {links.map((link, index) => {
        const isSelected = `/${segment ?? ''}` === link.url;

        return (
          <Box key={index} style={link.style}>
            <Button
              component={NextLink}
              color="primary.main.25"
              href={link.url}
              mb={1}
              p={0}
              size="large"
              title={t(link.name)}
              variant={isSelected ? 'solid' : 'text'}
            >
              <Icon color="text" name={link.icon} size="1.5rem" />
            </Button>
          </Box>
        );
      })}
    </Scrollable>
  );
}
