import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { MoviesState, Movie, ApiError } from '../../core/types'
import { MoviesService } from '../../services/moviesService'

// Initial state
const initialState: MoviesState = {
  movies: [],
  loading: false,
  error: null,
  currentMovie: null,
}

// Async thunks
export const fetchMovies = createAsyncThunk(
  'movies/fetchMovies',
  async (
    params: {
      page?: number
      pageSize?: number
      populate?: string
      sort?: string
      filters?: Record<string, unknown>
    } = {},
    { rejectWithValue },
  ) => {
    try {
      const response = await MoviesService.getMovies(params)
      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  },
)

export const fetchMovieByDocumentId = createAsyncThunk(
  'movies/fetchMovieByDocumentId',
  async (params: { documentId: string; populate?: string }, { rejectWithValue }) => {
    try {
      const response = await MoviesService.getMovieByDocumentId(params.documentId, params.populate)
      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  },
)

export const createMovie = createAsyncThunk(
  'movies/createMovie',
  async (movieData: Partial<Movie>, { rejectWithValue }) => {
    try {
      const response = await MoviesService.createMovie(movieData)
      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  },
)

export const updateMovieByDocumentId = createAsyncThunk(
  'movies/updateMovieByDocumentId',
  async (params: { documentId: string; data: Partial<Movie> }, { rejectWithValue }) => {
    try {
      const response = await MoviesService.updateMovieByDocumentId(params.documentId, params.data)
      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  },
)

export const deleteMovieByDocumentId = createAsyncThunk(
  'movies/deleteMovieByDocumentId',
  async (documentId: string, { rejectWithValue }) => {
    try {
      await MoviesService.deleteMovieByDocumentId(documentId)
      return documentId
    } catch (error) {
      return rejectWithValue(error)
    }
  },
)

// Movies slice
const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearCurrentMovie: (state) => {
      state.currentMovie = null
    },
    setCurrentMovie: (state, action: PayloadAction<Movie>) => {
      state.currentMovie = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch movies cases
      .addCase(fetchMovies.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.loading = false
        state.movies = action.payload
        state.error = null
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.loading = false
        state.error = getErrorMessage(action.payload)
      })
      // Fetch movie by documentId cases
      .addCase(fetchMovieByDocumentId.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMovieByDocumentId.fulfilled, (state, action) => {
        state.loading = false
        state.currentMovie = action.payload
        state.error = null
      })
      .addCase(fetchMovieByDocumentId.rejected, (state, action) => {
        state.loading = false
        state.error = getErrorMessage(action.payload)
      })
      // Create movie cases
      .addCase(createMovie.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createMovie.fulfilled, (state, action) => {
        state.loading = false
        state.movies.push(action.payload)
        state.error = null
      })
      .addCase(createMovie.rejected, (state, action) => {
        state.loading = false
        state.error = getErrorMessage(action.payload)
      })
      // Update movie by documentId cases
      .addCase(updateMovieByDocumentId.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateMovieByDocumentId.fulfilled, (state, action) => {
        state.loading = false
        const index = state.movies.findIndex((movie) => movie.documentId === action.payload.documentId)
        if (index !== -1) {
          state.movies[index] = action.payload
        }
        if (state.currentMovie?.documentId === action.payload.documentId) {
          state.currentMovie = action.payload
        }
        state.error = null
      })
      .addCase(updateMovieByDocumentId.rejected, (state, action) => {
        state.loading = false
        state.error = getErrorMessage(action.payload)
      })
      // Delete movie by documentId cases
      .addCase(deleteMovieByDocumentId.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteMovieByDocumentId.fulfilled, (state, action) => {
        state.loading = false
        state.movies = state.movies.filter((movie) => movie.documentId !== action.payload)
        if (state.currentMovie?.documentId === action.payload) {
          state.currentMovie = null
        }
        state.error = null
      })
      .addCase(deleteMovieByDocumentId.rejected, (state, action) => {
        state.loading = false
        state.error = getErrorMessage(action.payload)
      })
  },
})

function isApiError(payload: unknown): payload is ApiError {
  return (
    typeof payload === 'object' &&
    payload !== null &&
    'error' in payload &&
    typeof (payload as { error?: unknown }).error === 'object' &&
    (payload as { error?: unknown }).error !== null &&
    'message' in (payload as { error: { message?: unknown } }).error &&
    typeof (payload as { error: { message?: unknown } }).error.message === 'string'
  )
}

function getErrorMessage(payload: unknown): string {
  if (isApiError(payload)) {
    return payload.error.message
  }
  if (typeof payload === 'string') return payload
  return 'An unknown error occurred'
}

export const { clearError, clearCurrentMovie, setCurrentMovie } = moviesSlice.actions
export default moviesSlice.reducer
