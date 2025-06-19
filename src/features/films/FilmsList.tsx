import { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
  Chip,
  Divider,
  Pagination,
} from '@mui/material'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { fetchMovies } from '../../store/slices/moviesSlice'

const FilmsList = () => {
  const dispatch = useAppDispatch()
  const [currentPage, setCurrentPage] = useState(1)
  const { movies, loading, error, pagination } = useAppSelector((state) => state.movies)

  const pageSize = 5

  useEffect(() => {
    // Fetch movies when component mounts or page changes
    dispatch(
      fetchMovies({
        sort: 'release_date:asc', // Sort alphabetically by title
        pageSize: pageSize,
        page: currentPage,
      }),
    )
  }, [dispatch, currentPage])

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page)
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ py: 2 }}>
        <Alert severity="error">
          <Typography variant="h6">Error loading films</Typography>
          <Typography variant="body2">
            {typeof error === 'string' ? error : 'Failed to load films. Please try again.'}
          </Typography>
        </Alert>
      </Box>
    )
  }

  if (movies.length === 0) {
    return (
      <Box sx={{ py: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No films found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            It looks like there are no films in the database yet.
          </Typography>
        </Paper>
      </Box>
    )
  }

  return (
    <Box sx={{ py: 2 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Films Collection
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {pagination
            ? `Showing ${movies.length} of ${pagination.total} film${pagination.total !== 1 ? 's' : ''} (Page ${
                pagination.page
              } of ${pagination.pageCount})`
            : `${movies.length} film${movies.length !== 1 ? 's' : ''} available`}
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <List>
          {movies.map((movie) => (
            <ListItem
              key={movie.id}
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                mb: 1,
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="h6" component="span">
                      {movie.title}
                    </Typography>
                    {movie.release_date && (
                      <Chip label={new Date(movie.release_date).getFullYear()} size="small" variant="outlined" />
                    )}
                  </Box>
                }
                secondary={
                  <Box sx={{ mt: 1 }}>
                    {movie.description && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {movie.description.length > 150
                          ? `${movie.description.substring(0, 150)}...`
                          : movie.description}
                      </Typography>
                    )}
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                      {movie.average_rating && (
                        <Typography variant="caption" color="text.secondary">
                          <strong>Rating:</strong> {movie.average_rating}/10
                        </Typography>
                      )}
                      <Typography variant="caption" color="text.secondary">
                        <strong>Updated:</strong> {new Date(movie.updatedAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>

        {pagination && pagination.pageCount > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Pagination
              count={pagination.pageCount}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              size="large"
            />
          </Box>
        )}
      </Paper>
    </Box>
  )
}

export default FilmsList
