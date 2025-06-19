import { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  CircularProgress,
  Alert,
  Box,
  Typography,
  Tooltip,
  Pagination,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { fetchMovies, deleteMovieByDocumentId } from '../../store/slices/moviesSlice'
import { useNavigate } from 'react-router'

export default function MovieTable() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)
  const { movies, loading, error, pagination } = useAppSelector((state) => state.movies)

  const pageSize = 5

  useEffect(() => {
    dispatch(
      fetchMovies({
        sort: 'release_date:asc',
        pageSize: pageSize,
        page: currentPage,
      }),
    )
  }, [dispatch, currentPage])

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page)
  }

  const handleEdit = (movie: { id: number; documentId: string }) => {
    navigate(`/manage/${movie.documentId}`)
  }

  const handleDelete = (movie: { id: number; documentId: string }) => {
    if (window.confirm('Are you sure you want to delete this film?')) {
      dispatch(deleteMovieByDocumentId(movie.documentId))
    }
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
      <Alert severity="error" sx={{ my: 2 }}>
        {typeof error === 'string' ? error : 'Failed to load films.'}
      </Alert>
    )
  }

  if (!movies.length) {
    return (
      <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
        No films found.
      </Typography>
    )
  }

  return (
    <Box>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Release Date</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {movies.map((movie) => (
              <TableRow key={movie.id}>
                <TableCell>{movie.title}</TableCell>
                <TableCell>
                  {movie.description?.length > 60 ? movie.description.substring(0, 60) + '...' : movie.description}
                </TableCell>
                <TableCell>{movie.release_date}</TableCell>
                <TableCell>{movie.average_rating}</TableCell>
                <TableCell>
                  <Tooltip title="Edit">
                    <IconButton color="primary" onClick={() => handleEdit(movie)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton color="error" onClick={() => handleDelete(movie)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

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
    </Box>
  )
}
