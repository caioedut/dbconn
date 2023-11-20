import { isValidElement } from 'react';

import { BoxProps, ReactElement } from '@react-bulk/core';
import { Box, Loading, Text } from '@react-bulk/web';

import Icon from '@/components/Icon';
import { t } from '@/helpers/translate.helper';

export type StateProps = BoxProps & {
  children?: ReactElement;
  empty?: ReactElement | boolean;
  error?: ReactElement | boolean;
  loading?: ReactElement | boolean;
};

export default function State({ children, empty, error, loading, ...rest }: StateProps) {
  if (loading) {
    return isValidElement(loading) ? loading : <Loading center flex p={8} size={2.5} {...rest} />;
  }

  if (error) {
    return isValidElement(error) ? (
      error
    ) : (
      <Box center flex p={8} {...rest}>
        <Icon color="text" name="Frown" size="3rem" />
        <Text bold center mt={4} variant="secondary">
          {t('Something went wrong')}
        </Text>
      </Box>
    );
  }

  if (empty) {
    return isValidElement(empty) ? (
      empty
    ) : (
      <Box center flex p={8} {...rest}>
        <Icon color="gray.light" name="Folder" size="5rem" />
        <Text bold center color="text.secondary" mt={4}>
          {t('Empty')}
        </Text>
      </Box>
    );
  }

  return children;
}
