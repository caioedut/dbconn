import { BoxProps, ReactElement } from '@react-bulk/core';
import { Box, Divider, Progress, Text } from '@react-bulk/web';

export type PanelProps = BoxProps & {
  loading?: boolean;
  right?: ReactElement;
  title?: string;
};

export default function Panel({ title, children, loading, right, style, ...rest }: PanelProps) {
  return (
    <Box
      bg="background.secondary"
      border="1px solid primary"
      position="relative"
      style={[{ '&:not(:first-child)': { mt: 1 } }, style]}
      {...rest}
    >
      <Box bg="background.primary" p={2} zIndex={1}>
        <Box noWrap row>
          <Text bold flex numberOfLines={1} transform="uppercase" variant="secondary">
            {title}
          </Text>
          {Boolean(right) && (
            <Box center mr={-1} my={-2}>
              {right}
            </Box>
          )}
        </Box>

        <Box m={-2} mt={2}>
          {loading ? <Progress corners={0} h={1} /> : <Divider color="primary" opacity={1} />}
        </Box>
      </Box>

      {children}
    </Box>
  );
}
