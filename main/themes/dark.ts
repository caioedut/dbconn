import { ThemeEditProps } from '@react-bulk/core';

import base from './_base';

const dark: ThemeEditProps = {
  ...base,

  colors: {
    primary: '#2196f3',
  },

  custom: {
    id: 'dark',
  },

  mode: 'dark',
};

export default dark;
