import type { Movie } from './movie'

export interface ApiResponse<T = unknown> {
  data: T
  meta?: {
    pagination?: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

export interface ApiError {
  error: {
    status: number
    name: string
    message: string
    details?: Record<string, unknown>
  }
}

export type MoviesResponse = ApiResponse<Movie[]>
