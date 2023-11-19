import { BoxProps, ReactElement, useTheme } from '@react-bulk/core';
import { Box, Divider, Progress, Text } from '@react-bulk/web';

export type PanelProps = BoxProps & {
  loading?: boolean;
  right?: ReactElement;
  title?: string;
};

export default function Panel({ title, children, loading, right, style, ...rest }: PanelProps) {
  const theme = useTheme();

  const textColor = theme.contrast('primary');

  return (
    <Box
      bg="background"
      border="1px solid primary"
      position="relative"
      style={[{ '&:not(:first-child)': { mt: 1 } }, style]}
      {...rest}
    >
      {Boolean(title || right) && (
        <Box bg="primary" p={2} zIndex={1}>
          <Box noWrap row>
            {Boolean(title) && (
              <Text bold flex color={textColor} numberOfLines={1} transform="uppercase" variant="secondary">
                {title}
              </Text>
            )}
            {Boolean(right) && (
              <Box center mr={-1} my={-2}>
                {right}
              </Box>
            )}
          </Box>
        </Box>
      )}

      {loading ? (
        <Progress barStyle={{ borderRadius: '25%' }} color={theme.contrast('primary')} corners={0} h={1} />
      ) : (
        <Divider color="primary" opacity={1} />
      )}

      {children}
    </Box>
  );
}
