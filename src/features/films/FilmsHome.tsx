import { useEffect } from 'react'
import { Box, Typography, styled, CircularProgress, Alert } from '@mui/material'
import { EmojiEvents } from '@mui/icons-material'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { fetchTopMovies } from '../../store/slices/moviesSlice'
import { useNavigate } from 'react-router'
import FilmCard from './FilmCard'

const TopMoviesGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: theme.spacing(3),
  marginBottom: theme.spacing(4),
  maxWidth: '1200px',
  margin: '0 auto',
}))

const MoviesGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
  gap: theme.spacing(3),
  marginTop: theme.spacing(4),
}))

export default function FilmsHome() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { topMovies, loading, error } = useAppSelector((state) => state.movies)

  useEffect(() => {
    dispatch(fetchTopMovies(10))
  }, [dispatch])

  const handleMovieClick = (movieId: string) => {
    navigate(`/films/${movieId}`)
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={60} />
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ my: 4 }}>
        {typeof error === 'string' ? error : 'Failed to load recommended movies.'}
      </Alert>
    )
  }

  const topThree = topMovies.slice(0, 3)
  const remaining = topMovies.slice(3)

  return (
    <Box sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}
        >
          <EmojiEvents color="warning" />
          Recommended Movies
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Top rated films just for you
        </Typography>
      </Box>

      {topThree.length > 0 && (
        <>
          <Typography variant="h5" sx={{ textAlign: 'center', mb: 3 }}>
            Top Rated Movies
          </Typography>
          <TopMoviesGrid>
            {topThree.map((movie) => (
              <FilmCard key={movie.documentId} movie={movie} onClick={() => handleMovieClick(movie.documentId)} />
            ))}
          </TopMoviesGrid>
        </>
      )}

      {remaining.length > 0 && (
        <>
          <Typography variant="h5" sx={{ my: 3, textAlign: 'center' }}>
            More Great Movies
          </Typography>
          <MoviesGrid>
            {remaining.map((movie) => (
              <FilmCard key={movie.documentId} movie={movie} onClick={() => handleMovieClick(movie.documentId)} />
            ))}
          </MoviesGrid>
        </>
      )}
    </Box>
  )
}
