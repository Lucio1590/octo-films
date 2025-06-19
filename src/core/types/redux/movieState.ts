import type { Movie } from '../movie'

export interface ImportProgress {
  total: number
  completed: number
  failed: number
  errors: string[]
}

export interface PaginationInfo {
  page: number
  pageSize: number
  pageCount: number
  total: number
}

export interface MoviesState {
  movies: Movie[]
  loading: boolean
  error: string | null
  currentMovie: Movie | null
  importing: boolean
  importProgress: ImportProgress | null
  pagination: PaginationInfo | null
}
