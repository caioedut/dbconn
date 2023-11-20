import { ThemeEditProps } from '@react-bulk/core';

import base from './_base';

const dark: ThemeEditProps = {
  ...base,

  colors: {
    primary: '#2979ff',
  },

  custom: {
    id: 'dark',
    name: 'DbConn Dark',
  },

  mode: 'dark',
};

export default dark;
