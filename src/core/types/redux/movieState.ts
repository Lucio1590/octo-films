import type { Movie } from '../movie'

export interface MoviesState {
  movies: Movie[]
  loading: boolean
  error: string | null
  currentMovie: Movie | null
}
