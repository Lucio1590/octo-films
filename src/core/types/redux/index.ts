import type { AuthState } from './authState'
import type { MoviesState } from './movieState'

export interface RootState {
  auth: AuthState
  movies: MoviesState
}

export * from './authState'
export * from './movieState'
