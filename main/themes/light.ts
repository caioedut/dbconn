import { ThemeEditProps } from '@react-bulk/core';

import base from './_base';

const light: ThemeEditProps = {
  ...base,

  colors: {
    primary: '#3d5afe',
  },

  custom: {
    id: 'light',
  },

  mode: 'light',
};

export default light;
