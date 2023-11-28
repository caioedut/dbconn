import { forwardRef } from 'react';

import { BoxProps, RbkColor } from '@react-bulk/core';
import { Box } from '@react-bulk/web';

export type OverableProps = {
  active?: boolean;
  color?: RbkColor;
} & BoxProps;

function Overable({ active, color = 'primary.main.35', style, ...rest }: OverableProps, ref: any) {
  return <Box ref={ref} style={[active && { bg: color }, { '&:hover': { bg: color } }, style]} {...rest} />;
}

export default forwardRef(Overable);
