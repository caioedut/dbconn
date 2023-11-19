import * as icons from 'react-feather';

import { RbkColor, useTheme } from '@react-bulk/core';
import { Box } from '@react-bulk/web';

export type IconProps = {
  color?: RbkColor;
  name: string;
  size?: number | string;
};

export default function Icon({ name, color, size }: IconProps) {
  const theme = useTheme();

  color = theme.color(color ?? 'primary');
  size = (typeof size === 'string' ? theme.rem(Number(size.replace(/[^\d.]/g, ''))) : size) ?? theme.rem();

  // @ts-expect-error
  const Component = icons[name];

  if (!Component) {
    return <Box h={size} w={size} />;
  }

  return <Component color={color} size={size} />;
}
