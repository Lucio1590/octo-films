import type { Genre } from '../genre'

export interface GenreImportProgress {
  total: number
  completed: number
  failed: number
  errors: string[]
}

export interface GenresPaginationInfo {
  page: number
  pageSize: number
  pageCount: number
  total: number
}

export interface GenresSortInfo {
  field: 'name' | 'slug'
  direction: 'asc' | 'desc'
}

export interface GenresState {
  genres: Genre[]
  loading: boolean
  error: string | null
  currentGenre: Genre | null
  importing: boolean
  importProgress: GenreImportProgress | null
  pagination: GenresPaginationInfo | null
  sort: GenresSortInfo
}
