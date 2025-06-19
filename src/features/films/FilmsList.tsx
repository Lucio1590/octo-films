import { useEffect, useState } from 'react'
import { Box, Typography, Paper, CircularProgress, Alert, Divider, Pagination, styled } from '@mui/material'
import type { SelectChangeEvent } from '@mui/material'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { fetchMovies, setSortOptions } from '../../store/slices/moviesSlice'
import { useNavigate } from 'react-router'
import FilmCard from './FilmCard'
import FilmSorting from '../../ui/components/FilmSorting'

const StyledMoviesListContainer = styled(Box)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing(3)};
`

const StyledFilmCollectionHeader = styled(Box)`
  display: flex;
  flex-direction: row;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing(1)};
  @media (max-width: 1000px) {
    flex-direction: column;
    align-items: center;
    gap: ${({ theme }) => theme.spacing(2)};
  }
`

const FilmsList = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)
  const { movies, loading, error, pagination, sort } = useAppSelector((state) => state.movies)

  const pageSize = 12

  useEffect(() => {
    const sortString = `${sort.field}:${sort.direction}`
    dispatch(
      fetchMovies({
        sort: sortString,
        pageSize: pageSize,
        page: currentPage,
      }),
    )
  }, [dispatch, currentPage, sort])

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page)
  }

  const handleSortFieldChange = (event: SelectChangeEvent) => {
    const field = event.target.value as 'title' | 'release_date'
    dispatch(setSortOptions({ field, direction: sort.direction }))
    setCurrentPage(1) // Reset to first page when sorting changes
  }

  const handleSortDirectionChange = (event: SelectChangeEvent) => {
    const direction = event.target.value as 'asc' | 'desc'
    dispatch(setSortOptions({ field: sort.field, direction }))
    setCurrentPage(1) // Reset to first page when sorting changes
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
        <StyledFilmCollectionHeader>
          <Typography variant="h4" gutterBottom>
            Films Collection
          </Typography>
          <FilmSorting
            handleSortDirectionChange={handleSortDirectionChange}
            handleSortFieldChange={handleSortFieldChange}
          />
          <Typography variant="body2" color="text.secondary">
            {pagination
              ? `Showing ${movies.length} of ${pagination.total} film${pagination.total !== 1 ? 's' : ''} (Page ${
                  pagination.page
                } of ${pagination.pageCount})`
              : `${movies.length} film${movies.length !== 1 ? 's' : ''} available`}
          </Typography>
        </StyledFilmCollectionHeader>

        <Divider sx={{ mb: 2 }} />

        <StyledMoviesListContainer>
          {movies.map((movie) => (
            <Box key={movie.id}>
              <FilmCard
                movie={movie}
                onClick={() => {
                  // Navigate to film detail page
                  navigate(`/films/${movie.documentId}`)
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
