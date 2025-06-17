import { Box, Container, CssBaseline, styled, ThemeProvider } from '@mui/material'
import { Outlet, ScrollRestoration, useLocation } from 'react-router'
import HomePage from './features/landing/HomePage'
import Navbar from './ui/components/NavBar/Navbar'
import { darkTheme, lightTheme } from './ui/themes'
import { useState } from 'react'

const StyledAppWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  minHeight: '100vh',
}))

const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(2),
}))

function App() {
  const location = useLocation()
  const [mode] = useState('dark')
  const theme = mode === 'light' ? lightTheme : darkTheme

  return (
    <ThemeProvider theme={theme}>
      <StyledAppWrapper>
        <ScrollRestoration />
        <CssBaseline />
        {location.pathname === '/' ? (
          <HomePage />
        ) : (
          <>
            {<Navbar />}
            <StyledContainer maxWidth="xl">
              <Outlet />
            </StyledContainer>
          </>
        )}
      </StyledAppWrapper>
    </ThemeProvider>
  )
}

export default App
