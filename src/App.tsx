import { Box, Container, CssBaseline, styled, ThemeProvider, CircularProgress } from '@mui/material'
import { Outlet, ScrollRestoration, useLocation } from 'react-router'
import { useState, useEffect } from 'react'
import HomePage from './features/landing/HomePage'
import Navbar from './ui/components/NavBar/Navbar'
import { darkTheme, lightTheme } from './ui/themes'
import { useAppDispatch, useAppSelector } from './hooks/redux'
import { initializeAuth } from './store/slices/authSlice'

const StyledAppWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  minHeight: '100vh',
}))

const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(2),
}))

function App() {
  const location = useLocation()
  const dispatch = useAppDispatch()
  const [mode] = useState('dark')
  const theme = mode === 'light' ? lightTheme : darkTheme

  const { isAuthenticated, loading } = useAppSelector((state) => state.auth)

  // Track if initial auth check has been performed
  const [authInitialized, setAuthInitialized] = useState(false)

  // Check if user is authenticated on app load
  useEffect(() => {
    const initAuth = async () => {
      await dispatch(initializeAuth())
      setAuthInitialized(true)
    }
    initAuth()
  }, [dispatch])

  // Routes that don't require navbar
  const publicRoutes = ['/', '/login', '/register', '/not-found', '/server-error']
  const isPublicRoute = publicRoutes.includes(location.pathname)

  // Show navbar only if authenticated and not on public routes
  const showNavbar = isAuthenticated && !isPublicRoute

  // Show loading spinner during initial auth check
  if (!authInitialized && loading) {
    return (
      <ThemeProvider theme={theme}>
        <StyledAppWrapper>
          <CssBaseline />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '100vh',
            }}
          >
            <CircularProgress />
          </Box>
        </StyledAppWrapper>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <StyledAppWrapper>
        <ScrollRestoration />
        <CssBaseline />
        {location.pathname === '/' ? (
          <HomePage />
        ) : (
          <>
            {showNavbar && <Navbar />}
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
