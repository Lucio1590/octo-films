import type { Genre } from '../core/types'
import { apiClient } from '../core/api/client'

export interface GenresResponse {
  data: Genre[]
  meta?: {
    pagination?: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

export interface GenreWithTopMovies extends Genre {
  movies: Array<{
    id: number
    documentId: string
    title: string
    description: string
    release_date: string
    average_rating: number
    cover_image: string
    background_image: string
    createdAt: string
    updatedAt: string
    publishedAt: string
  }>
}

export interface GenresWithTopMoviesResponse {
  data: GenreWithTopMovies[]
}

/**
 * GenresService provides methods to interact with the genres API endpoints.
 * These functions are designed specifically for a Strapi backend, following its conventions
 * for filtering, pagination, population, and data structure.
 */
export class GenresService {
  /**
   * Fetches a paginated list of genres from the hosted backend.
   * Supports query parameters for pagination, population, sorting, and filtering.
   * @param params - Optional query parameters for pagination, population, sorting, and filtering.
   */
  static async getGenres(params?: {
    page?: number
    pageSize?: number
    populate?: string
    sort?: string
    filters?: Record<string, unknown>
  }): Promise<GenresResponse> {
    const searchParams = new URLSearchParams()

    // The backend uses 'pagination[page]' and 'pagination[pageSize]' for pagination
    if (params?.page) {
      searchParams.append('pagination[page]', params.page.toString())
    }

    if (params?.pageSize) {
      searchParams.append('pagination[pageSize]', params.pageSize.toString())
    }

    // 'populate' is used to include related entities
    if (params?.populate) {
      searchParams.append('populate', params.populate)
    }

    if (params?.sort) {
      searchParams.append('sort', params.sort)
    }

    // 'filters' follows Strapi's filtering syntax
    if (params?.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(`filters[${key}]`, String(value))
        }
      })
    }

    const queryString = searchParams.toString()
    const url = `/api/genres${queryString ? `?${queryString}` : ''}`

    return apiClient.get<GenresResponse>(url)
  }

  /**
   * Fetches a single genre by its documentId.
   * Supports 'populate' parameter to include related entities.
   * @param documentId - The documentId of the genre to fetch.
   * @param populate - Optional populate parameter for Strapi.
   */
  static async getGenreByDocumentId(documentId: string, populate?: string): Promise<{ data: Genre }> {
    const searchParams = new URLSearchParams()

    if (populate) {
      searchParams.append('populate', populate)
    }

    const queryString = searchParams.toString()
    const url = `/api/genres/${documentId}${queryString ? `?${queryString}` : ''}`

    return apiClient.get<{ data: Genre }>(url)
  }

  /**
   * Creates a new genre entry.
   * The payload structure follows Strapi's convention: { data: genreData }
   * @param genreData - Partial genre data to create.
   */
  static async createGenre(genreData: Partial<Genre>): Promise<{ data: Genre }> {
    return apiClient.post<{ data: Genre }>('/api/genres', { data: genreData })
  }

  /**
   * Updates an existing genre entry using documentId.
   * The payload structure follows Strapi's convention: { data: genreData }
   * @param documentId - The documentId of the genre to update.
   * @param genreData - Partial genre data to update.
   */
  static async updateGenreByDocumentId(documentId: string, genreData: Partial<Genre>): Promise<{ data: Genre }> {
    return apiClient.put<{ data: Genre }>(`/api/genres/${documentId}`, { data: genreData })
  }

  /**
   * Deletes a genre entry by its documentId.
   * @param documentId - The documentId of the genre to delete.
   */
  static async deleteGenreByDocumentId(documentId: string): Promise<{ data: Genre }> {
    return apiClient.delete<{ data: Genre }>(`/api/genres/${documentId}`)
  }

  /**
   * Fetches genres with their top movies by rating.
   */
  static async getGenresWithTopMovies(): Promise<GenresWithTopMoviesResponse> {
    const response = await apiClient.get<GenreWithTopMovies[]>('/api/genres-with-top-movies')
    // The API returns an array directly, so we wrap it in the expected format
    return { data: response }
  }
}
