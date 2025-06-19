import { useEffect, useState } from 'react'
import { Box, Typography, Paper, CircularProgress, Alert, Divider, Pagination, styled } from '@mui/material'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { fetchMovies } from '../../store/slices/moviesSlice'
import FilmCard from './FilmCard'

// sx={{
//             display: 'grid',
//             gridTemplateColumns: {
//               xs: '1fr',
//               sm: 'repeat(2, 1fr)',
//               md: 'repeat(3, 1fr)',
//               lg: 'repeat(4, 1fr)',
//             },
//             gap: 3,
//           }}

const StyledMoviesListContainer = styled(Box)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing(3)};
`

const FilmsList = () => {
  const dispatch = useAppDispatch()
  const [currentPage, setCurrentPage] = useState(1)
  const { movies, loading, error, pagination } = useAppSelector((state) => state.movies)

  const pageSize = 6

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
        <Box display="flex" flexDirection="row" alignItems="baseline" justifyContent="space-between" mb={1}>
          <Typography variant="h4" gutterBottom>
            Films Collection
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {pagination
              ? `Showing ${movies.length} of ${pagination.total} film${pagination.total !== 1 ? 's' : ''} (Page ${
                  pagination.page
                } of ${pagination.pageCount})`
              : `${movies.length} film${movies.length !== 1 ? 's' : ''} available`}
          </Typography>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <StyledMoviesListContainer>
          {movies.map((movie) => (
            <Box key={movie.id}>
              <FilmCard
                movie={movie}
                onClick={() => {
                  // Handle click to view movie details - could navigate to detail page
                  console.log('Clicked movie:', movie.title)
                }}
              />
            </Box>
          ))}
        </StyledMoviesListContainer>

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
