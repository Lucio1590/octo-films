import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { fetchMovies } from '../../store/slices/moviesSlice'

const SimpleFilmsList = () => {
  const dispatch = useAppDispatch()
  const { movies, loading, error } = useAppSelector((state) => state.movies)

  useEffect(() => {
    // Fetch movies when component mounts
    dispatch(
      fetchMovies({
        sort: 'title:asc', // Sort alphabetically by title
        pageSize: 50, // Limit to 50 movies for now
      }),
    )
  }, [dispatch])

  if (loading) {
    return <div>Loading films...</div>
  }

  if (error) {
    return <div>Error loading films: {typeof error === 'string' ? error : 'Unknown error'}</div>
  }

  if (movies.length === 0) {
    return <div>No films found</div>
  }

  return (
    <div>
      <h2>Films List</h2>
      <ul>
        {movies.map((movie) => (
          <li key={movie.id}>{movie.title}</li>
        ))}
      </ul>
    </div>
  )
}

export default SimpleFilmsList
