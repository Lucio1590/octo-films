// Redux store and types
export { store } from './store'
export type { RootState, AppDispatch } from './store'

// Redux hooks
export { useAppDispatch, useAppSelector } from './hooks/redux'

// Auth slice exports
export {
  loginUser,
  registerUser,
  getCurrentUser,
  logoutUser,
  initializeAuth,
  clearError as clearAuthError,
  setCredentials,
} from './store/slices/authSlice'

// Movies slice exports
export {
  fetchMovies,
  fetchMovieByDocumentId,
  createMovie,
  updateMovieByDocumentId,
  deleteMovieByDocumentId,
  clearError as clearMoviesError,
  clearCurrentMovie,
  setCurrentMovie,
} from './store/slices/moviesSlice'

// Services
export { AuthService, MoviesService } from './services'

// Types

// API Client
export { apiClient } from './core/api/client'
