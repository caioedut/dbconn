import { ThemeEditProps } from '@react-bulk/core';

import base from './_base';

const dark: ThemeEditProps = {
  ...base,

  colors: {
    editor: {
      bracket: '#7D7463',
      comment: '#A8A196',
      function: '#ED5AB3',
      keyword: '#0090FF',
      number: '#B06161',
      special: '#7D7463',
      string: '#4D975F',
    },

    primary: '#2979ff',
  },

  custom: {
    id: 'dark',
    name: 'DbConn Dark',
  },

  mode: 'dark',
};

export default dark;
