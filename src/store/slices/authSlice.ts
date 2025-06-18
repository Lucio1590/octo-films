import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { AuthState, LoginCredentials, RegisterCredentials, User } from '../../core/types'
import { AuthService } from '../../services/authService'

// Initial state
const initialState: AuthState = {
  user: null,
  token: AuthService.getToken(),
  isAuthenticated: false, // Set to false initially, will be set to true after validating token
  loading: false,
  error: null,
}

// Async thunks
export const loginUser = createAsyncThunk('auth/login', async (credentials: LoginCredentials, { rejectWithValue }) => {
  try {
    const response = await AuthService.login(credentials)
    return response
  } catch (error) {
    return rejectWithValue(error)
  }
})

export const registerUser = createAsyncThunk(
  'auth/register',
  async (credentials: RegisterCredentials, { rejectWithValue }) => {
    try {
      const response = await AuthService.register(credentials)
      return response
    } catch (error) {
      return rejectWithValue(error)
    }
  },
)

export const initializeAuth = createAsyncThunk('auth/initialize', async (_, { rejectWithValue }) => {
  try {
    const token = AuthService.getToken()
    if (token) {
      const user = await AuthService.me()
      return { user, token }
    }
    return null
  } catch (error) {
    // If token is invalid, clear it
    AuthService.logout()
    return rejectWithValue(error)
  }
})

export const getCurrentUser = createAsyncThunk('auth/getCurrentUser', async (_, { rejectWithValue }) => {
  try {
    const user = await AuthService.me()
    return user
  } catch (error) {
    return rejectWithValue(error)
  }
})

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await AuthService.logout()
})

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.jwt
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        const error = action.payload as { error?: { message?: string }; message?: string } | string
        if (typeof error === 'string') {
          state.error = error
        } else {
          state.error = error?.error?.message || error?.message || 'Login failed'
        }
        state.isAuthenticated = false
        state.user = null
        state.token = null
      })
      // Register cases
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.jwt
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        const error = action.payload as { error?: { message?: string }; message?: string } | string
        if (typeof error === 'string') {
          state.error = error
        } else {
          state.error = error?.error?.message || error?.message || 'Registration failed'
        }
        state.isAuthenticated = false
        state.user = null
        state.token = null
      })
      // Initialize auth cases
      .addCase(initializeAuth.pending, (state) => {
        state.loading = true
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.loading = false
        if (action.payload) {
          state.user = action.payload.user
          state.token = action.payload.token
          state.isAuthenticated = true
        } else {
          state.user = null
          state.token = null
          state.isAuthenticated = false
        }
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.loading = false
        state.isAuthenticated = false
        state.user = null
        state.token = null
      })
      // Get current user cases
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.isAuthenticated = true
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.loading = false
        state.isAuthenticated = false
        state.user = null
        state.token = null
      })
      // Logout cases
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null
        state.token = null
        state.isAuthenticated = false
        state.error = null
      })
  },
})

export const { clearError, setCredentials } = authSlice.actions
export default authSlice.reducer
