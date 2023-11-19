import { ThemeEditProps } from '@react-bulk/core';

const base: ThemeEditProps = {
  typography: {
    fontSize: 14,
  },

  components: {
    // Backdrop: {
    //   defaultStyles: {
    //     root: {
    //       backgroundColor: 'rgba(255,255,255,)',
    //     },
    //   },
    // },
    Card: {
      defaultProps: {
        corners: 0,
      },
    },
  },
};

export default base;
