import { useState } from 'react'
import { Typography, Box, Paper, Button, Stack } from '@mui/material'
import { Add, Upload } from '@mui/icons-material'
import { useAppSelector } from '../../hooks/redux'
import { isAdmin } from '../../utils/auth'
import { Navigate, useNavigate } from 'react-router'
import MovieTable from './MovieTable'
import ImportMoviesDialog from './ImportMoviesDialog'

export default function Dashboard() {
  const { user } = useAppSelector((state) => state.auth)
  const navigate = useNavigate()
  const [importDialogOpen, setImportDialogOpen] = useState(false)

  // Check if user is logged in and has admin privileges
  if (!isAdmin(user)) {
    return <Navigate to="/films" replace />
  }

  return (
    <Box sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h3" gutterBottom>
            Admin Dashboard
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<Upload />}
              onClick={() => setImportDialogOpen(true)}
              data-testid="import-json-btn"
            >
              Import from JSON
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Add />}
              onClick={() => navigate('/create-film')}
              data-testid="create-film-btn"
            >
              Create Film
            </Button>
          </Stack>
        </Box>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Manage all films in the database below. You can create individual films or import multiple films from a TMDB
          JSON file.
        </Typography>
        <MovieTable />
      </Paper>

      <ImportMoviesDialog open={importDialogOpen} onClose={() => setImportDialogOpen(false)} />
    </Box>
  )
}
