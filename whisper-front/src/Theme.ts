import { createTheme } from '@mui/material/styles';

const theme = createTheme({

  typography: {
    fontFamily: [
      'Poppins',
      'sans-serif',
    ].join(','),
    fontWeightMedium: 600,
    body1: {
      color: '#030303',
      fontWeight: 600,
    },
    button: {
      fontWeight: 600,
    },
  },

  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          fontSize: "15px",
          fontWeight: 500,

        },
      },
      defaultProps: {
        size: 'small',
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          fontSize: "15px",
          fontWeight: 500,
          '&.Mui-disabled': {
            backgroundColor: '#f4f4f4',
          },
        }
      },
      defaultProps: {
        size: 'small',
      },
    },
    MuiInputLabel: {
      styleOverrides: { 
        root: {
          fontSize: "15px",
          fontWeight: 500,
        }
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          color: '#030303',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          minHeight: 0,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          display: 'flex',
          backgroundColor: 'transparent',
          justifyContent: 'center',
          height: '64px',
          boxShadow: 'none',
          position: 'relative',
          borderBottom: '1px solid #f0f0f0',
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          '@media (min-width:600px)': {
            minHeight: '0 !important',
          },
        },
      },
    },
  },
});

export default theme;
