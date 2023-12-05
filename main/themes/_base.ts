import { ThemeEditProps } from '@react-bulk/core';

const base: ThemeEditProps = {
  components: {
    Card: {
      defaultProps: {
        corners: 0,
      },
    },
    Modal: {
      defaultStyles: {
        root: {
          border: '1px solid text',
        },
      },
    },
    Toaster: {
      defaultProps: {
        halign: 'right',
        // offset: { y: 11 },
      },
    },
  },

  typography: {
    fontSize: 14,
  },
};

export default base;
