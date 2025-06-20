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
  Chip,
} from '@mui/material'

import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { fetchGenres, deleteGenreByDocumentId } from '../../store/slices/genresSlice'

export default function GenresTable() {
  const dispatch = useAppDispatch()
  const [currentPage, setCurrentPage] = useState(1)
  const { genres, loading, error, pagination, sort } = useAppSelector((state) => state.genres)

  const pageSize = 10

  useEffect(() => {
    const sortString = `${sort.field}:${sort.direction}`
    dispatch(
      fetchGenres({
        sort: sortString,
        pageSize: pageSize,
        page: currentPage,
      }),
    )
  }, [dispatch, currentPage, sort])

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page)
  }

  const handleEdit = (genre: { id: number; documentId: string }) => {
    // TODO: Navigate to edit form
    console.log('Edit genre:', genre)
  }

  const handleDelete = (genre: { id: number; documentId: string; name: string }) => {
    if (window.confirm(`Are you sure you want to delete the genre "${genre.name}"?`)) {
      dispatch(deleteGenreByDocumentId(genre.documentId))
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
        {typeof error === 'string' ? error : 'Failed to load genres.'}
      </Alert>
    )
  }

  if (!genres.length) {
    return (
      <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
        No genres found.
      </Typography>
    )
  }

  return (
    <Box>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Slug</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {genres.map((genre) => (
              <TableRow key={genre.id}>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {genre.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip label={genre.slug} size="small" variant="outlined" sx={{ fontFamily: 'monospace' }} />
                </TableCell>
                <TableCell>
                  <Tooltip title="Edit">
                    <IconButton color="primary" onClick={() => handleEdit(genre)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton color="error" onClick={() => handleDelete(genre)}>
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
