import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Chip,
  Rating,
  Button,
  IconButton,
  styled,
} from '@mui/material'
import { ArrowBack, CalendarToday, Star, Edit, Person } from '@mui/icons-material'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { fetchMovieByDocumentId, clearCurrentMovie } from '../../store/slices/moviesSlice'
import { isAdmin } from '../../utils/auth'

const HeroSection = styled(Box)(() => ({
  position: 'relative',
  minHeight: '60vh',
  display: 'flex',
  alignItems: 'center',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    zIndex: 1,
  },
}))

const ContentOverlay = styled(Box)({
  position: 'relative',
  zIndex: 2,
  color: 'white',
  width: '100%',
})

const PosterContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(4),
  alignItems: 'flex-start',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
}))

const PosterImage = styled('img')(({ theme }) => ({
  width: 300,
  maxWidth: '100%',
  height: 450,
  objectFit: 'cover',
  borderRadius: theme.spacing(1),
  boxShadow: theme.shadows[8],
  [theme.breakpoints.down('md')]: {
    width: 250,
    height: 375,
  },
}))

export default function FilmDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { currentMovie, loading, error } = useAppSelector((state) => state.movies)
  const { user } = useAppSelector((state) => state.auth)

  useEffect(() => {
    if (id) {
      dispatch(fetchMovieByDocumentId({ documentId: id, populate: ['genres', 'reviews'] }))
    }

    // Clean up when component unmounts
    return () => {
      dispatch(clearCurrentMovie())
    }
  }, [id, dispatch])

  const handleGoBack = () => {
    navigate(-1)
  }

  const handleEdit = () => {
    if (currentMovie) {
      navigate(`/manage/${currentMovie.documentId}`)
    }
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
      <Box sx={{ py: 4 }}>
        <Alert severity="error">{typeof error === 'string' ? error : 'Failed to load movie details.'}</Alert>
        <Button onClick={handleGoBack} sx={{ mt: 2 }}>
          Go Back
        </Button>
      </Box>
    )
  }

  if (!currentMovie) {
    return (
      <Box sx={{ py: 4 }}>
        <Alert severity="warning">Movie not found.</Alert>
        <Button onClick={handleGoBack} sx={{ mt: 2 }}>
          Go Back
        </Button>
      </Box>
    )
  }

  const releaseYear = currentMovie.release_date ? new Date(currentMovie.release_date).getFullYear() : null
  const rating = currentMovie.average_rating || 0

  return (
    <Box>
      {/* Hero Section with Background Image */}
      <HeroSection
        sx={{
          backgroundImage: currentMovie.background_image
            ? `url(${currentMovie.background_image})`
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <ContentOverlay>
          <Box sx={{ px: { xs: 2, md: 4 }, py: 4 }}>
            {/* Back Button */}
            <Box sx={{ mb: 3 }}>
              <IconButton onClick={handleGoBack} sx={{ color: 'white', mr: 2 }}>
                <ArrowBack />
              </IconButton>
              {isAdmin(user) && (
                <IconButton onClick={handleEdit} sx={{ color: 'white' }}>
                  <Edit />
                </IconButton>
              )}
            </Box>

            <PosterContainer>
              {/* Movie Poster */}
              <Box>
                {currentMovie.cover_image ? (
                  <PosterImage
                    src={currentMovie.cover_image}
                    alt={currentMovie.title}
                    onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: 300,
                      height: 450,
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 1,
                      border: '2px dashed rgba(255, 255, 255, 0.3)',
                    }}
                  >
                    <Typography variant="h6" color="rgba(255, 255, 255, 0.7)">
                      No Image
                    </Typography>
                  </Box>
                )}
              </Box>

              {/* Movie Info */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                  {currentMovie.title}
                </Typography>

                {releaseYear && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <CalendarToday />
                    <Typography variant="h6">{releaseYear}</Typography>
                  </Box>
                )}

                {/* Rating */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Star sx={{ color: 'warning.main', fontSize: 28 }} />
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                      {rating.toFixed(1)}
                    </Typography>
                    <Typography variant="body1" color="rgba(255, 255, 255, 0.8)">
                      / 10
                    </Typography>
                  </Box>
                  <Rating value={rating / 2} precision={0.1} size="large" readOnly sx={{ ml: 1 }} />
                </Box>

                {/* Genres */}
                {currentMovie.genres && currentMovie.genres.length > 0 && (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                    {currentMovie.genres.map((genre) => (
                      <Chip
                        key={genre.documentId}
                        label={genre.name}
                        variant="outlined"
                        sx={{
                          color: 'white',
                          borderColor: 'rgba(255, 255, 255, 0.5)',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          },
                        }}
                      />
                    ))}
                  </Box>
                )}

                {/* Description Preview */}
                {currentMovie.description && (
                  <Typography
                    variant="body1"
                    sx={{
                      lineHeight: 1.6,
                      color: 'rgba(255, 255, 255, 0.9)',
                      maxWidth: '600px',
                    }}
                  >
                    {currentMovie.description.length > 200
                      ? `${currentMovie.description.substring(0, 200)}...`
                      : currentMovie.description}
                  </Typography>
                )}
              </Box>
            </PosterContainer>
          </Box>
        </ContentOverlay>
      </HeroSection>

      {/* Detailed Description Section */}
      {currentMovie.description && currentMovie.description.length > 200 && (
        <Box sx={{ py: 4, px: { xs: 2, md: 4 } }}>
          <Paper sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              Overview
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary' }}>
              {currentMovie.description}
            </Typography>
          </Paper>
        </Box>
      )}

      {/* Additional Details */}
      <Box sx={{ py: 4, px: { xs: 2, md: 4 } }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            Details
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Release Date
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {currentMovie.release_date ? new Date(currentMovie.release_date).toLocaleDateString() : 'Not available'}
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Average Rating
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {rating.toFixed(1)} / 10
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Last Updated
              </Typography>
              <Typography variant="body1">{new Date(currentMovie.updatedAt).toLocaleDateString()}</Typography>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Reviews Section */}
      {currentMovie.reviews && currentMovie.reviews.length > 0 && (
        <Box sx={{ py: 4, px: { xs: 2, md: 4 } }}>
          <Paper sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              Reviews ({currentMovie.reviews.length})
            </Typography>
            <Box sx={{ mt: 3 }}>
              {currentMovie.reviews.map((review) => (
                <Paper
                  key={review.documentId}
                  elevation={1}
                  sx={{
                    p: 3,
                    mb: 2,
                    borderLeft: '4px solid',
                    borderLeftColor: 'primary.main',
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Person sx={{ color: 'text.secondary' }} />
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {review.username || 'Anonymous User'}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Rating value={review.rating / 2} precision={0.1} size="small" readOnly />
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {review.rating.toFixed(1)}/10
                      </Typography>
                    </Box>
                  </Box>

                  {review.title && (
                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
                      {review.title}
                    </Typography>
                  )}

                  <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
                    {review.body}
                  </Typography>

                  <Typography variant="caption" color="text.secondary">
                    {new Date(review.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </Typography>
                </Paper>
              ))}
            </Box>
          </Paper>
        </Box>
      )}
    </Box>
  )
}
