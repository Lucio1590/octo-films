import type { AuthState } from './authState'
import type { MoviesState } from './movieState'
import type { GenresState } from './genresState'

export interface RootState {
  auth: AuthState
  movies: MoviesState
  genres: GenresState
}

export * from './authState'
export * from './movieState'
export * from './genresState'
