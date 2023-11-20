import { ThemeEditProps } from '@react-bulk/core';

import base from './_base';

const light: ThemeEditProps = {
  ...base,

  colors: {
    editor: {
      bracket: '#7D7463',
      comment: '#B4B4B4',
      function: '#ED5AB3',
      keyword: '#2870BD',
      number: '#B06161',
      special: '#7D7463',
      string: '#4D975F',
    },

    primary: '#3d5afe',
  },

  custom: {
    id: 'light',
    name: 'DbConn Light',
  },

  mode: 'light',
};

export default light;
