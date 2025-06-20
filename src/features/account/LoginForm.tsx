import { useEffect } from 'react'
import { Box, Paper, TextField, Button, Typography, Link, Alert, CircularProgress } from '@mui/material'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link as RouterLink, useNavigate, useLocation } from 'react-router'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { loginUser, clearError, getCurrentUser } from '../../store/slices/authSlice'

// Zod validation schema
const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, 'Email or username is required')
    .refine((value) => {
      // Check if it's an email or username
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(value) || value.length >= 3
    }, 'Please enter a valid email or username (min 3 characters)'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100, 'Password is too long'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginForm() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth)

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/films'

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  })

  // Clear errors when component mounts
  useEffect(() => {
    dispatch(clearError())
  }, [dispatch])

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, navigate, from])

  const onSubmit = async (data: LoginFormData) => {
    try {
      await dispatch(loginUser(data)).unwrap()
      // Fetch current user with role information after successful login
      await dispatch(getCurrentUser()).unwrap()
      reset()
      navigate(from, { replace: true })
    } catch (error) {
      // Error is handled by the Redux slice
      console.error('Login failed:', error)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 400,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Welcome Back
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2 }}>
          Sign in to your account
        </Typography>

        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>Server Status Notice</strong>
            <br />
            If login times out or takes longer than usual, the backend server may be sleeping. Please wait 1-2 minutes
            for the server to wake up and try again.
          </Typography>
        </Alert>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {typeof error === 'string' ? error : 'Login failed. Please try again.'}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField
            {...register('identifier')}
            fullWidth
            label="Email or Username"
            type="text"
            margin="normal"
            error={!!errors.identifier}
            helperText={errors.identifier?.message}
            disabled={loading}
            autoComplete="username"
            autoFocus
          />

          <TextField
            {...register('password')}
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            error={!!errors.password}
            helperText={errors.password?.message}
            disabled={loading}
            autoComplete="current-password"
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading || !isValid}
            sx={{ mt: 3, mb: 2 }}
          >
            {loading ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </Button>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2">
              Don't have an account?{' '}
              <Link component={RouterLink} to="/register" sx={{ textDecoration: 'none' }}>
                Create one here
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  )
}
