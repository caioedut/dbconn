import { ThemeEditProps } from '@react-bulk/core';

import base from './_base';

const light: ThemeEditProps = {
  ...base,

  colors: {
    primary: '#3f51b5',
  },

  custom: {
    id: 'light',
  },

  mode: 'light',
};

export default light;
