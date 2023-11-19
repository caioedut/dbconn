import { ReactElement } from '@react-bulk/core';
import { Box, Loading, Text } from '@react-bulk/web';

import Icon from '@/components/Icon';
import { t } from '@/helpers/translate.helper';

export type StateProps = {
  children?: ReactElement;
  empty?: any | boolean;
  error?: any | boolean;
  loading?: any | boolean;
};

export default function State({ children, empty, error, loading, ...rest }: StateProps) {
  if (loading) {
    return <Loading center flex size={2.5} {...rest} />;
  }

  if (error) {
    return (
      <Box center flex {...rest}>
        <Icon color="gray.light" name="Frown" size="5rem" />
        <Text bold center color="text.secondary" mt={4}>
          {t('Something went wrong')}
        </Text>
      </Box>
    );
  }

  if (empty) {
    return (
      <Box center flex {...rest}>
        <Icon color="gray.light" name="Folder" size="5rem" />
        <Text bold center color="text.secondary" mt={4}>
          {t('Empty')}
        </Text>
      </Box>
    );
  }

  return <>{children}</>;
}
