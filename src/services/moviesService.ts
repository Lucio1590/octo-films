import type { MoviesResponse, Movie } from '../core/types'
import { apiClient } from '../core/api/client'

/**
 * MoviesService provides methods to interact with the movies API endpoints.
 * These functions are designed specifically for a Strapi backend, following its conventions
 * for filtering, pagination, population, and data structure.
 */
export class MoviesService {
  /**
   * Fetches a paginated list of movies from Strapi.
   * Supports Strapi's query parameters for pagination, population, sorting, and filtering.
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

    // Strapi uses 'pagination[page]' and 'pagination[pageSize]' for pagination
    if (params?.page) {
      searchParams.append('pagination[page]', params.page.toString())
    }

    if (params?.pageSize) {
      searchParams.append('pagination[pageSize]', params.pageSize.toString())
    }

    // 'populate' is used by Strapi to include related entities
    if (params?.populate) {
      searchParams.append('populate', params.populate)
    }

    // 'sort' is used by Strapi to sort results
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

    // Uses a generic API client to send a GET request to the Strapi movies endpoint
    return apiClient.get<MoviesResponse>(url)
  }

  /**
   * Fetches a single movie by its ID from Strapi.
   * Supports Strapi's 'populate' parameter to include related entities.
   * @param id - The ID of the movie to fetch.
   * @param populate - Optional populate parameter for Strapi.
   */
  static async getMovieById(id: number, populate?: string): Promise<{ data: Movie }> {
    const searchParams = new URLSearchParams()

    if (populate) {
      searchParams.append('populate', populate)
    }

    const queryString = searchParams.toString()
    const url = `/api/movies/${id}${queryString ? `?${queryString}` : ''}`

    // Uses the API client to fetch a single movie from Strapi
    return apiClient.get<{ data: Movie }>(url)
  }

  /**
   * Creates a new movie entry in Strapi.
   * The payload structure follows Strapi's convention: { data: movieData }
   * @param movieData - Partial movie data to create.
   */
  static async createMovie(movieData: Partial<Movie>): Promise<{ data: Movie }> {
    // POST request to Strapi's movies endpoint with the required data structure
    return apiClient.post<{ data: Movie }>('/api/movies', { data: movieData })
  }

  /**
   * Updates an existing movie entry in Strapi.
   * The payload structure follows Strapi's convention: { data: movieData }
   * @param id - The ID of the movie to update.
   * @param movieData - Partial movie data to update.
   */
  static async updateMovie(id: number, movieData: Partial<Movie>): Promise<{ data: Movie }> {
    // PUT request to Strapi's movies endpoint with the required data structure
    return apiClient.put<{ data: Movie }>(`/api/movies/${id}`, { data: movieData })
  }

  /**
   * Deletes a movie entry from Strapi by its ID.
   * @param id - The ID of the movie to delete.
   */
  static async deleteMovie(id: number): Promise<{ data: Movie }> {
    // DELETE request to Strapi's movies endpoint
    return apiClient.delete<{ data: Movie }>(`/api/movies/${id}`)
  }
}
