import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import moviesReducer from './slices/moviesSlice'
import genresReducer from './slices/genresSlice'
import genresWithTopMoviesReducer from './slices/genresWithTopMoviesSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    movies: moviesReducer,
    genres: genresReducer,
    genresWithTopMovies: genresWithTopMoviesReducer,
  },
  devTools: import.meta.env.MODE !== 'production',
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
