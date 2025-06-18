import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { MoviesState, Movie } from '../../core/types'
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

export const fetchMovieById = createAsyncThunk(
  'movies/fetchMovieById',
  async (params: { id: number; populate?: string }, { rejectWithValue }) => {
    try {
      const response = await MoviesService.getMovieById(params.id, params.populate)
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

export const updateMovie = createAsyncThunk(
  'movies/updateMovie',
  async (params: { id: number; data: Partial<Movie> }, { rejectWithValue }) => {
    try {
      const response = await MoviesService.updateMovie(params.id, params.data)
      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  },
)

export const deleteMovie = createAsyncThunk('movies/deleteMovie', async (id: number, { rejectWithValue }) => {
  try {
    await MoviesService.deleteMovie(id)
    return id
  } catch (error) {
    return rejectWithValue(error)
  }
})

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
        state.error = action.payload as string
      })
      // Fetch movie by ID cases
      .addCase(fetchMovieById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMovieById.fulfilled, (state, action) => {
        state.loading = false
        state.currentMovie = action.payload
        state.error = null
      })
      .addCase(fetchMovieById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
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
        state.error = action.payload as string
      })
      // Update movie cases
      .addCase(updateMovie.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateMovie.fulfilled, (state, action) => {
        state.loading = false
        const index = state.movies.findIndex((movie) => movie.id === action.payload.id)
        if (index !== -1) {
          state.movies[index] = action.payload
        }
        if (state.currentMovie?.id === action.payload.id) {
          state.currentMovie = action.payload
        }
        state.error = null
      })
      .addCase(updateMovie.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Delete movie cases
      .addCase(deleteMovie.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteMovie.fulfilled, (state, action) => {
        state.loading = false
        state.movies = state.movies.filter((movie) => movie.id !== action.payload)
        if (state.currentMovie?.id === action.payload) {
          state.currentMovie = null
        }
        state.error = null
      })
      .addCase(deleteMovie.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError, clearCurrentMovie, setCurrentMovie } = moviesSlice.actions
export default moviesSlice.reducer
