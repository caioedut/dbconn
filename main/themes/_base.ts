import { ThemeEditProps } from '@react-bulk/core';

const base: ThemeEditProps = {
  components: {
    Card: {
      defaultProps: {
        corners: 0,
      },
    },
    Toaster: {
      defaultProps: {
        halign: 'right',
      },
    },
  },

  typography: {
    fontSize: 14,
  },
};

export default base;
