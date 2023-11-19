import { ReactElement, ScrollableProps } from '@react-bulk/core';
import { Box, Card, Divider, Progress, Scrollable, Text } from '@react-bulk/web';

export type PanelProps = ScrollableProps & {
  loading?: boolean;
  right?: ReactElement;
  title?: string;
};

export default function Panel({ title, children, flex, loading, right, style, ...rest }: PanelProps) {
  return (
    <Scrollable
      bg="background.secondary"
      border="1px solid primary"
      flex={flex}
      position="relative"
      style={[{ '&:not(:first-child)': { mt: 1 } }, style]}
      {...rest}
    >
      <Box bg="background.secondary" p={2} position="sticky" t={0} zIndex={1}>
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

      <Box flex p={2}>
        {children}
      </Box>
    </Scrollable>
  );
}
