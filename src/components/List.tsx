import { Fragment } from 'react';

import { BoxProps, CardProps, useTheme } from '@react-bulk/core';
import { Box, Card, Divider, Text } from '@react-bulk/web';

import Icon, { IconProps } from '@/components/Icon';

export type ListProps = CardProps & {
  gap?: number;

  items: (BoxProps & {
    divider?: boolean;
    endIcon?: IconProps | string;
    icon?: IconProps | string;
    label?: string;
    selected?: boolean;
  })[];
};

export default function List({ gap = 2, items, ...rest }: ListProps) {
  const theme = useTheme();

  return (
    <Card p={gap / 2} px={0} {...rest}>
      {items.map(({ label, divider, endIcon, icon, selected, style, ...rest }, index) => (
        <Fragment key={index}>
          {divider ? (
            <Divider my={1} {...rest} />
          ) : (
            <Box
              bg={selected ? 'primary.main' : undefined}
              p={gap}
              style={[{ '&:hover': { bg: 'primary.main.35' } }, style]}
              {...rest}
            >
              <Box center noWrap row>
                {Boolean(icon) && (
                  <Box mr={4} mt={-0.5}>
                    {typeof icon === 'string' ? (
                      <Icon color={selected ? 'contrast' : undefined} name={icon} />
                    ) : (
                      <Icon color={selected ? 'contrast' : undefined} {...(icon as IconProps)} />
                    )}
                  </Box>
                )}

                <Text flex color={selected ? theme.contrast('primary') : 'text'} pr={2}>
                  {label}
                </Text>

                {Boolean(endIcon) && (
                  <Box ml={4} mt={-0.5}>
                    {typeof endIcon === 'string' ? (
                      <Icon color={selected ? 'contrast' : undefined} name={endIcon} />
                    ) : (
                      <Icon color={selected ? 'contrast' : undefined} {...(endIcon as IconProps)} />
                    )}
                  </Box>
                )}
              </Box>
            </Box>
          )}
        </Fragment>
      ))}
    </Card>
  );
}
