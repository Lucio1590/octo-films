import type { Movie } from '../movie'

export interface ImportProgress {
  total: number
  completed: number
  failed: number
  errors: string[]
}

export interface MoviesState {
  movies: Movie[]
  loading: boolean
  error: string | null
  currentMovie: Movie | null
  importing: boolean
  importProgress: ImportProgress | null
}
