import type { TMDBMovie, Movie } from '../core/types'

/**
 * Maps a TMDB movie object to our backend movie format
 * @param tmdbMovie - The TMDB movie object to map
 * @returns Partial movie object ready for backend creation
 */
export function mapTMDBMovieToBackend(tmdbMovie: TMDBMovie): Partial<Movie> {
  // TMDB poster and backdrop paths need to be converted to full URLs
  const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'
  const TMDB_BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/w1280'

  return {
    title: tmdbMovie.title,
    description: tmdbMovie.overview || '',
    release_date: tmdbMovie.release_date,
    average_rating: tmdbMovie.vote_average,
    cover_image: tmdbMovie.poster_path ? `${TMDB_IMAGE_BASE_URL}${tmdbMovie.poster_path}` : '',
    background_image: tmdbMovie.backdrop_path ? `${TMDB_BACKDROP_BASE_URL}${tmdbMovie.backdrop_path}` : '',
  }
}

/**
 * Parses JSON content and extracts an array of TMDB movies
 * Supports both { results: TMDBMovie[] } and TMDBMovie[] formats
 * @param jsonContent - The JSON string content
 * @returns Array of TMDB movies
 */
export function parseTMDBJSON(jsonContent: string): TMDBMovie[] {
  try {
    const data = JSON.parse(jsonContent)

    // Handle TMDB API response format with 'results' array
    if (data.results && Array.isArray(data.results)) {
      return data.results
    }

    // Handle direct array format
    if (Array.isArray(data)) {
      return data
    }

    // Handle single movie object
    if (data.id && data.title) {
      return [data]
    }

    throw new Error('Invalid JSON format: Expected array of movies or TMDB API response format')
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('Invalid JSON file: Please ensure the file contains valid JSON')
    }
    throw error
  }
}

/**
 * Validates that a TMDB movie object has required fields
 * @param movie - The TMDB movie to validate
 * @returns boolean indicating if the movie is valid
 */
export function isValidTMDBMovie(movie: unknown): movie is TMDBMovie {
  return (
    typeof movie === 'object' &&
    movie !== null &&
    'id' in movie &&
    'title' in movie &&
    'overview' in movie &&
    'release_date' in movie &&
    'vote_average' in movie &&
    typeof (movie as TMDBMovie).id === 'number' &&
    typeof (movie as TMDBMovie).title === 'string' &&
    (movie as TMDBMovie).title.trim() !== '' &&
    typeof (movie as TMDBMovie).overview === 'string' &&
    typeof (movie as TMDBMovie).release_date === 'string' &&
    typeof (movie as TMDBMovie).vote_average === 'number'
  )
}
