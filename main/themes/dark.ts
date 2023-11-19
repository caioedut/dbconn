import { ThemeEditProps } from '@react-bulk/core';
import base from './_base';

const dark: ThemeEditProps = {
  ...base,

  mode: 'dark',

  colors: {
    primary: '#4FC3F7',
    error: '#E57373',
  },
};

export default dark;
