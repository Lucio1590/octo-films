/**
 * TMDB (The Movie Database) API response format for movie data
 * Used for importing movies from TMDB JSON files
 */
export interface TMDBMovie {
  id: number
  title: string
  overview: string
  release_date: string
  vote_average: number
  poster_path: string | null
  backdrop_path: string | null
  adult: boolean
  genre_ids: number[]
  original_language: string
  original_title: string
  popularity: number
  video: boolean
  vote_count: number
}

/**
 * Standard format for TMDB JSON files containing an array of movies
 */
export interface TMDBMoviesData {
  results?: TMDBMovie[]
  // Support direct array format as well
  [key: number]: TMDBMovie
}
