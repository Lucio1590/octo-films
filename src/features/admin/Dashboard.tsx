import { Typography, Box, Paper, Button } from '@mui/material'
import { useAppSelector } from '../../hooks/redux'
import { isAdmin } from '../../utils/auth'
import { Navigate, useNavigate } from 'react-router'
import MovieTable from './MovieTable'

export default function Dashboard() {
  const { user } = useAppSelector((state) => state.auth)
  const navigate = useNavigate()

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
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/create-film')}
            data-testid="create-film-btn"
          >
            Create Film
          </Button>
        </Box>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Manage all films in the database below.
        </Typography>
        <MovieTable />
      </Paper>
    </Box>
  )
}
