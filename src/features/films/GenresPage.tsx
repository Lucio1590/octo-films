import { useEffect } from 'react'
import { Box, Typography, CircularProgress, Alert, Paper, styled, Chip } from '@mui/material'
import { Category, Star } from '@mui/icons-material'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { useNavigate } from 'react-router'
import FilmCard from './FilmCard'
import { fetchGenresWithTopMovies } from '../../store/slices/genresWithTopMoviesSlice'

const GenreSection = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(4),
  borderRadius: theme.spacing(2),
}))

const GenreHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: theme.spacing(1),
  },
}))

const MoviesGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
  gap: theme.spacing(3),
  marginTop: theme.spacing(2),
}))

export default function GenresPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { genresWithTopMovies, loading, error } = useAppSelector((state) => state.genresWithTopMovies)

  useEffect(() => {
    dispatch(fetchGenresWithTopMovies())
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
        {typeof error === 'string' ? error : 'Failed to load genres.'}
      </Alert>
    )
  }

  return (
    <Box sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}
        >
          <Category color="primary" />
          Genres
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Explore movies by genre
        </Typography>
      </Box>

      {genresWithTopMovies.map((genre) => (
        <GenreSection key={genre.documentId} elevation={2}>
          <GenreHeader>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h4" component="h2" sx={{ fontWeight: 600 }}>
                {genre.name}
              </Typography>
              <Chip
                label={genre.slug}
                size="small"
                variant="outlined"
                color="primary"
                sx={{ fontFamily: 'monospace' }}
              />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Star sx={{ color: 'warning.main', fontSize: 20 }} />
              <Typography variant="body2" color="text.secondary">
                Top Rated
              </Typography>
            </Box>
          </GenreHeader>

          {genre.topMovies.length > 0 ? (
            <MoviesGrid>
              {genre.topMovies.map((movie) => (
                <FilmCard key={movie.documentId} movie={movie} onClick={() => handleMovieClick(movie.documentId)} />
              ))}
            </MoviesGrid>
          ) : (
            <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              No movies found for this genre yet.
            </Typography>
          )}
        </GenreSection>
      ))}

      {genresWithTopMovies.length === 0 && (
        <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 8 }}>
          No genres with movies found.
        </Typography>
      )}
    </Box>
  )
}
