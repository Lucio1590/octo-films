import { Box, Paper, Typography } from '@mui/material'
import { useAppSelector } from '../../hooks/redux'
import { isAdmin } from '../../utils/auth'
import { Navigate, useParams } from 'react-router'
import GenreForm from './GenreForm'

export default function GenreFormPage() {
  const { user } = useAppSelector((state) => state.auth)
  const { id } = useParams<{ id: string }>()
  const isEditMode = Boolean(id)

  if (!isAdmin(user)) {
    return <Navigate to="/films" replace />
  }

  return (
    <Box sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
      <Paper sx={{ p: 4, minWidth: 400, maxWidth: 600 }}>
        <Typography variant="h4" gutterBottom>
          {isEditMode ? 'Edit Genre' : 'Create Genre'}
        </Typography>
        <GenreForm />
      </Paper>
    </Box>
  )
}
