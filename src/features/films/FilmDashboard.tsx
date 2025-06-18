import { Typography, Box, Paper } from '@mui/material'
import { useAppSelector } from '../../hooks/redux'
import FilmsList from './FilmsList'

export default function FilmDashboard() {
  const { user } = useAppSelector((state) => state.auth)

  return (
    <Box sx={{ py: 4 }}>
      <Paper sx={{ p: 4, textAlign: 'center', mb: 3 }}>
        <Typography variant="h3" gutterBottom>
          Welcome to Films Dashboard
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Hello, {user?.username}! 👋
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Browse and manage your film collection below.
        </Typography>
      </Paper>

      {/* Films List Component */}
      <FilmsList />
    </Box>
  )
}
