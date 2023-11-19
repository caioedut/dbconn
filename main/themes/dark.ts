import { ThemeEditProps } from '@react-bulk/core';

import base from './_base';

const dark: ThemeEditProps = {
  ...base,

  colors: {
    primary: '#6573c3',
  },

  custom: {
    id: 'dark',
  },

  mode: 'dark',
};

export default dark;
