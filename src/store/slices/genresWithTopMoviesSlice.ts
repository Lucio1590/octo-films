import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { GenresService, type GenreWithTopMovies } from '../../services/genresService'

interface GenresWithTopMoviesState {
  genresWithTopMovies: GenreWithTopMovies[]
  loading: boolean
  error: string | null
}

const initialState: GenresWithTopMoviesState = {
  genresWithTopMovies: [],
  loading: false,
  error: null,
}

export const fetchGenresWithTopMovies = createAsyncThunk(
  'genresWithTopMovies/fetchGenresWithTopMovies',
  async (_, { rejectWithValue }) => {
    try {
      const response = await GenresService.getGenresWithTopMovies()
      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  },
)

const genresWithTopMoviesSlice = createSlice({
  name: 'genresWithTopMovies',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGenresWithTopMovies.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchGenresWithTopMovies.fulfilled, (state, action) => {
        state.loading = false
        state.genresWithTopMovies = action.payload
        state.error = null
      })
      .addCase(fetchGenresWithTopMovies.rejected, (state, action) => {
        state.loading = false
        state.error = typeof action.payload === 'string' ? action.payload : 'Failed to load genres with top movies'
      })
  },
})

export const { clearError } = genresWithTopMoviesSlice.actions
export default genresWithTopMoviesSlice.reducer
