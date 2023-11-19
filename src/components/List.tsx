import { Fragment } from 'react';

import { BoxProps, CardProps } from '@react-bulk/core';
import { Box, Card, Divider, Text } from '@react-bulk/web';

import Icon from '@/components/Icon';

export type ListProps = CardProps & {
  gap?: number;

  items: (BoxProps & {
    divider?: boolean;
    icon?: string;
    label?: string;
  })[];
};

export default function List({ gap = 2, items, ...rest }: ListProps) {
  return (
    <Card px={0} py={gap / 2} {...rest}>
      {items.map(({ label, divider, icon, style, ...rest }, index) => (
        <Fragment key={index}>
          {divider ? (
            <Divider my={1} {...rest} />
          ) : (
            <Box p={gap} style={[{ '&:hover': { bg: 'primary.main.25' } }, style]} {...rest}>
              <Box center noWrap row>
                {icon && <Icon mr={4} mt={-0.5} name={icon} />}
                <Text flex pr={2}>
                  {label}
                </Text>
              </Box>
            </Box>
          )}
        </Fragment>
      ))}
    </Card>
  );
}
