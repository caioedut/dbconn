import { ThemeEditProps } from '@react-bulk/core';

const base: ThemeEditProps = {
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

  typography: {
    fontSize: 14,
  },
};

export default base;
