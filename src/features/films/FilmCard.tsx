import { Card, CardMedia, CardContent, Typography, Box, Chip, Rating, CardActionArea, styled } from '@mui/material'
import { CalendarToday, Star } from '@mui/icons-material'
import type { Movie } from '../../core/types'

interface FilmCardProps {
  movie: Movie
  onClick?: () => void
}

// sx={{
//         height: '100%',
//         display: 'flex',
//         flexDirection: 'column',
//         transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
//         '&:hover': {
//           transform: 'translateY(-4px)',
//           boxShadow: (theme) => theme.shadows[8],
//         },
//       }}

const StyledMovieCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  },
}))

export default function FilmCard({ movie, onClick }: FilmCardProps) {
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : null
  const rating = movie.average_rating || 0

  return (
    <StyledMovieCard>
      <CardActionArea onClick={onClick} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {movie.cover_image ? (
          <CardMedia
            component="img"
            height="300"
            image={movie.cover_image}
            alt={movie.title}
            sx={{
              objectFit: 'cover',
              backgroundColor: 'grey.200',
            }}
            onError={(e) => {
              // Hide the image if it fails to load
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
            }}
          />
        ) : (
          <Box
            sx={{
              height: 300,
              backgroundColor: 'grey.100',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              color: 'text.secondary',
              border: '1px dashed',
              borderColor: 'grey.300',
            }}
          >
            <Box sx={{ fontSize: '3rem', mb: 1 }}>🎬</Box>
            <Typography variant="body2" sx={{ textAlign: 'center', px: 2 }}>
              {movie.title}
            </Typography>
          </Box>
        )}

        <CardContent sx={{ flexGrow: 1, p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
            <Typography variant="h6" component="h3" sx={{ fontWeight: 600, flexGrow: 1, mr: 1 }}>
              {movie.title}
            </Typography>
            {releaseYear && (
              <Chip icon={<CalendarToday />} label={releaseYear} size="small" variant="outlined" color="primary" />
            )}
          </Box>

          {movie.description && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 2,
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                lineHeight: 1.4,
                height: '4.2em', // 3 lines * 1.4 line-height
              }}
            >
              {movie.description}
            </Typography>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 'auto' }}>
            <Star sx={{ color: 'warning.main', fontSize: 20 }} />
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {rating.toFixed(1)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              / 10
            </Typography>
            <Rating
              value={rating / 2} // Convert from 10-point to 5-point scale
              precision={0.1}
              size="small"
              readOnly
              sx={{ ml: 1 }}
            />
          </Box>

          {movie.genres && movie.genres.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
              {movie.genres.slice(0, 3).map((genre) => (
                <Chip
                  key={genre.documentId}
                  label={genre.name}
                  size="small"
                  variant="outlined"
                  color="secondary"
                  sx={{ fontSize: '0.75rem', height: '20px' }}
                />
              ))}
              {movie.genres.length > 3 && (
                <Chip
                  label={`+${movie.genres.length - 3}`}
                  size="small"
                  variant="outlined"
                  color="default"
                  sx={{ fontSize: '0.75rem', height: '20px' }}
                />
              )}
            </Box>
          )}
        </CardContent>
      </CardActionArea>
    </StyledMovieCard>
  )
}
