import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { GenresState, Genre, ApiError, GenreImportProgress } from '../../core/types'
import { GenresService } from '../../services/genresService'

// Helper function to create a slug from a name
const createSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

// Helper function to parse categories JSON
const parseCategoriesJSON = (jsonContent: string): { categories: string[]; slugs?: string[] } => {
  try {
    const parsed = JSON.parse(jsonContent)

    // Handle both array and object format
    if (Array.isArray(parsed)) {
      return { categories: parsed }
    }

    if (parsed.categories && Array.isArray(parsed.categories)) {
      return {
        categories: parsed.categories,
        slugs: parsed.slugs || undefined,
      }
    }

    throw new Error('Invalid JSON format')
  } catch (error) {
    throw new Error(`Failed to parse JSON: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Helper function to validate genre data
const isValidGenreData = (name: string): boolean => {
  return typeof name === 'string' && name.trim().length > 0
}

// Initial state
const initialState: GenresState = {
  genres: [],
  loading: false,
  error: null,
  currentGenre: null,
  importing: false,
  importProgress: null,
  pagination: null,
  sort: {
    field: 'name',
    direction: 'asc',
  },
}

// Async thunks
export const fetchGenres = createAsyncThunk(
  'genres/fetchGenres',
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
      const response = await GenresService.getGenres(params)
      return response // Return the complete response including pagination metadata
    } catch (error) {
      return rejectWithValue(error)
    }
  },
)

export const fetchGenreByDocumentId = createAsyncThunk(
  'genres/fetchGenreByDocumentId',
  async (params: { documentId: string; populate?: string }, { rejectWithValue }) => {
    try {
      const response = await GenresService.getGenreByDocumentId(params.documentId, params.populate)
      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  },
)

export const createGenre = createAsyncThunk(
  'genres/createGenre',
  async (genreData: Partial<Genre>, { rejectWithValue }) => {
    try {
      const response = await GenresService.createGenre(genreData)
      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  },
)

export const updateGenreByDocumentId = createAsyncThunk(
  'genres/updateGenreByDocumentId',
  async (params: { documentId: string; data: Partial<Genre> }, { rejectWithValue }) => {
    try {
      const response = await GenresService.updateGenreByDocumentId(params.documentId, params.data)
      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  },
)

export const deleteGenreByDocumentId = createAsyncThunk(
  'genres/deleteGenreByDocumentId',
  async (documentId: string, { rejectWithValue }) => {
    try {
      await GenresService.deleteGenreByDocumentId(documentId)
      return documentId
    } catch (error) {
      return rejectWithValue(error)
    }
  },
)

export const importGenresFromJSON = createAsyncThunk(
  'genres/importGenresFromJSON',
  async (jsonContent: string, { rejectWithValue, dispatch }) => {
    try {
      // Parse the JSON and extract categories
      const { categories, slugs } = parseCategoriesJSON(jsonContent)

      // Validate and filter categories
      const validCategories = categories.filter(isValidGenreData)

      if (validCategories.length === 0) {
        throw new Error('No valid genres found in the JSON file')
      }

      const results = {
        total: validCategories.length,
        completed: 0,
        failed: 0,
        errors: [] as string[],
        importedGenres: [] as Genre[],
      }

      // Import genres one by one
      for (let i = 0; i < validCategories.length; i++) {
        try {
          const categoryName = validCategories[i]
          const categorySlug = slugs && slugs[i] ? slugs[i] : createSlug(categoryName)

          const genreData = {
            name: categoryName,
            slug: categorySlug,
          }

          // Update progress
          dispatch(
            updateGenreImportProgress({
              total: results.total,
              completed: i,
              failed: results.failed,
              errors: [...results.errors], // Create a copy to avoid extensibility issues
            }),
          )

          const response = await GenresService.createGenre(genreData)
          results.importedGenres.push(response.data)
          results.completed++
        } catch (error) {
          results.failed++
          const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
          // Use spread operator to create new array instead of push
          results.errors = [...results.errors, `Genre "${validCategories[i]}": ${errorMessage}`]
        }
      }

      // Final progress update
      dispatch(
        updateGenreImportProgress({
          total: results.total,
          completed: results.completed,
          failed: results.failed,
          errors: [...results.errors], // Create a copy to avoid extensibility issues
        }),
      )

      return {
        imported: results.importedGenres,
        summary: {
          total: results.total,
          completed: results.completed,
          failed: results.failed,
          errors: results.errors,
        },
      }
    } catch (error) {
      return rejectWithValue(error)
    }
  },
)

// Genres slice
const genresSlice = createSlice({
  name: 'genres',
  initialState,
  reducers: {
    clearGenresError: (state) => {
      state.error = null
    },
    clearCurrentGenre: (state) => {
      state.currentGenre = null
    },
    setCurrentGenre: (state, action: PayloadAction<Genre>) => {
      state.currentGenre = action.payload
    },
    setGenresSortOptions: (state, action: PayloadAction<{ field: 'name' | 'slug'; direction: 'asc' | 'desc' }>) => {
      state.sort = action.payload
    },
    updateGenreImportProgress: (state, action: PayloadAction<GenreImportProgress>) => {
      state.importProgress = action.payload
    },
    startGenreImport: (state) => {
      state.importing = true
      state.importProgress = null
      state.error = null
    },
    finishGenreImport: (state) => {
      state.importing = false
    },
    clearGenreImportProgress: (state) => {
      state.importProgress = null
      state.importing = false
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch genres cases
      .addCase(fetchGenres.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchGenres.fulfilled, (state, action) => {
        state.loading = false
        state.genres = action.payload.data
        state.pagination = action.payload.meta?.pagination || null
        state.error = null
      })
      .addCase(fetchGenres.rejected, (state, action) => {
        state.loading = false
        state.error = getErrorMessage(action.payload)
      })
      // Fetch genre by documentId cases
      .addCase(fetchGenreByDocumentId.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchGenreByDocumentId.fulfilled, (state, action) => {
        state.loading = false
        state.currentGenre = action.payload
        state.error = null
      })
      .addCase(fetchGenreByDocumentId.rejected, (state, action) => {
        state.loading = false
        state.error = getErrorMessage(action.payload)
      })
      // Create genre cases
      .addCase(createGenre.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createGenre.fulfilled, (state, action) => {
        state.loading = false
        state.genres.push(action.payload)
        state.error = null
      })
      .addCase(createGenre.rejected, (state, action) => {
        state.loading = false
        state.error = getErrorMessage(action.payload)
      })
      // Update genre by documentId cases
      .addCase(updateGenreByDocumentId.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateGenreByDocumentId.fulfilled, (state, action) => {
        state.loading = false
        const index = state.genres.findIndex((genre) => genre.documentId === action.payload.documentId)
        if (index !== -1) {
          state.genres[index] = action.payload
        }
        if (state.currentGenre?.documentId === action.payload.documentId) {
          state.currentGenre = action.payload
        }
        state.error = null
      })
      .addCase(updateGenreByDocumentId.rejected, (state, action) => {
        state.loading = false
        state.error = getErrorMessage(action.payload)
      })
      // Delete genre by documentId cases
      .addCase(deleteGenreByDocumentId.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteGenreByDocumentId.fulfilled, (state, action) => {
        state.loading = false
        state.genres = state.genres.filter((genre) => genre.documentId !== action.payload)
        if (state.currentGenre?.documentId === action.payload) {
          state.currentGenre = null
        }
        state.error = null
      })
      .addCase(deleteGenreByDocumentId.rejected, (state, action) => {
        state.loading = false
        state.error = getErrorMessage(action.payload)
      })
      // Import genres from JSON cases
      .addCase(importGenresFromJSON.pending, (state) => {
        state.importing = true
        state.error = null
      })
      .addCase(importGenresFromJSON.fulfilled, (state, action) => {
        state.importing = false
        if (action.payload.imported.length > 0) {
          state.genres.push(...action.payload.imported)
        }
        state.error = null
      })
      .addCase(importGenresFromJSON.rejected, (state, action) => {
        state.importing = false
        state.error = getErrorMessage(action.payload)
      })
  },
})

function isApiError(payload: unknown): payload is ApiError {
  return typeof payload === 'object' && payload !== null && 'error' in payload
}

function getErrorMessage(payload: unknown): string {
  if (isApiError(payload)) {
    return payload.error.message || 'An error occurred'
  }
  if (payload instanceof Error) {
    return payload.message
  }
  if (typeof payload === 'string') {
    return payload
  }
  return 'An unknown error occurred'
}

export const {
  clearGenresError,
  clearCurrentGenre,
  setCurrentGenre,
  setGenresSortOptions,
  updateGenreImportProgress,
  startGenreImport,
  finishGenreImport,
  clearGenreImportProgress,
} = genresSlice.actions
export default genresSlice.reducer
