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
  importMoviesFromJSON,
  clearError as clearMoviesError,
  clearCurrentMovie,
  setCurrentMovie,
  updateImportProgress,
  startImport,
  finishImport,
  clearImportProgress,
} from './store/slices/moviesSlice'

// Genres slice exports
export {
  fetchGenres,
  fetchGenreByDocumentId,
  createGenre,
  updateGenreByDocumentId,
  deleteGenreByDocumentId,
  importGenresFromJSON,
  clearGenresError,
  clearCurrentGenre,
  setCurrentGenre,
  updateGenreImportProgress,
  startGenreImport,
  finishGenreImport,
  clearGenreImportProgress,
  setGenresSortOptions,
} from './store/slices/genresSlice'

// Services
export { AuthService, MoviesService, GenresService } from './services'

// Types

// API Client
export { apiClient } from './core/api/client'
