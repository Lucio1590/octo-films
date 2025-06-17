import { createTheme } from '@mui/material'

// THEME SETUP
export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1a237e',
    },
    secondary: {
      main: '#f7c948',
    },
    background: {
      default: '#fdf9f3',
      paper: '#f6f3ea',
    },
    text: {
      primary: '#1C170D',
      secondary: '#7a6f53',
    },
  },
  typography: {
    fontFamily: 'Inter, Arial, sans-serif',
    h2: { fontWeight: 700 },
    h4: { fontWeight: 600 },
    h6: { fontWeight: 700 },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          borderBottom: '1px solid #e0e0e0',
          color: '#333333',
          '& .MuiToolbar-root': {
            minHeight: '64px',
            paddingLeft: '24px',
            paddingRight: '24px',
          },
          '& .MuiButton-root': {
            color: '#333333',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
            },
          },
        },
      },
    },
  },
})

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#fff',
    },
    secondary: {
      main: '#f7c948',
    },
    background: {
      default: '#18140b',
      paper: '#232014',
    },
    text: {
      primary: '#fff',
      secondary: '#b6a97a',
    },
  },
  typography: {
    fontFamily: 'Inter, Arial, sans-serif',
    h2: { fontWeight: 700 },
    h4: { fontWeight: 600 },
    h6: { fontWeight: 700 },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#2c2c2c',
          boxShadow: 'none',
          borderBottom: '1px solid #3a3a3a',
          '& .MuiToolbar-root': {
            minHeight: '64px',
            paddingLeft: '24px',
            paddingRight: '24px',
          },
          '& .MuiButton-root': {
            color: '#ffffff',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
            },
          },
        },
      },
    },
  },
})
