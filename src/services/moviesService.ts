import type { MoviesResponse, Movie } from '../core/types'
import { apiClient } from '../core/api/client'

/**
 * MoviesService provides methods to interact with the movies API endpoints.
 * These functions are designed specifically for a Strapi backend, following its conventions
 * for filtering, pagination, population, and data structure.
 */
export class MoviesService {
  /**
   * Fetches a paginated list of movies from the hosted backend.
   * Supports query parameters for pagination, population, sorting, and filtering.
   * @param params - Optional query parameters for pagination, population, sorting, and filtering.
   */
  static async getMovies(params?: {
    page?: number
    pageSize?: number
    populate?: string
    sort?: string
    filters?: Record<string, unknown>
  }): Promise<MoviesResponse> {
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
    const url = `/api/movies${queryString ? `?${queryString}` : ''}`

    return apiClient.get<MoviesResponse>(url)
  }

  /**
   * Fetches a single movie by its documentId.
   * Supports 'populate' parameter to include related entities.
   * @param documentId - The documentId of the movie to fetch.
   * @param populate - Optional populate parameter for Strapi.
   */
  static async getMovieByDocumentId(documentId: string, populate?: string): Promise<{ data: Movie }> {
    const searchParams = new URLSearchParams()

    if (populate) {
      searchParams.append('populate', populate)
    }

    const queryString = searchParams.toString()
    const url = `/api/movies/${documentId}${queryString ? `?${queryString}` : ''}`

    return apiClient.get<{ data: Movie }>(url)
  }

  /**
   * Creates a new movie entry.
   * The payload structure follows Strapi's convention: { data: movieData }
   * @param movieData - Partial movie data to create.
   */
  static async createMovie(movieData: Partial<Movie>): Promise<{ data: Movie }> {
    return apiClient.post<{ data: Movie }>('/api/movies', { data: movieData })
  }

  /**
   * Updates an existing movie entry using documentId.
   * The payload structure follows Strapi's convention: { data: movieData }
   * @param documentId - The documentId of the movie to update.
   * @param movieData - Partial movie data to update.
   */
  static async updateMovieByDocumentId(documentId: string, movieData: Partial<Movie>): Promise<{ data: Movie }> {
    return apiClient.put<{ data: Movie }>(`/api/movies/${documentId}`, { data: movieData })
  }

  /**
   * Deletes a movie entry by its documentId.
   * @param documentId - The documentId of the movie to delete.
   */
  static async deleteMovieByDocumentId(documentId: string): Promise<{ data: Movie }> {
    return apiClient.delete<{ data: Movie }>(`/api/movies/${documentId}`)
  }

  /**
   * Fetches top movies by average rating.
   * @param limit - Number of top movies to fetch (default: 10)
   */
  static async getTopMovies(limit: number = 10): Promise<MoviesResponse> {
    const searchParams = new URLSearchParams()
    searchParams.append('pagination[pageSize]', limit.toString())
    searchParams.append('sort', 'average_rating:desc')
    searchParams.append('populate', 'genres')

    return apiClient.get<MoviesResponse>(`/api/movies?${searchParams.toString()}`)
  }
}
