import { Typography, Box, Paper, Alert } from '@mui/material'
import { useAppSelector } from '../../hooks/redux'
import { isAdmin } from '../../utils/auth'
import { Navigate } from 'react-router'

export default function Dashboard() {
  const { user } = useAppSelector((state) => state.auth)

  // Check if user is logged in and has admin privileges
  if (!isAdmin(user)) {
    return <Navigate to="/films" replace />
  }

  return (
    <Box sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h3" gutterBottom>
          Admin Dashboard
        </Typography>
        <Alert severity="info" sx={{ mb: 3 }}>
          Welcome to the admin dashboard, {user?.username}! You have {user?.role?.name} privileges.
        </Alert>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Dashboard Features (Coming Soon):
        </Typography>
        <Box component="ul" sx={{ pl: 3 }}>
          <Typography component="li" variant="body1" sx={{ mb: 1 }}>
            User Management
          </Typography>
          <Typography component="li" variant="body1" sx={{ mb: 1 }}>
            Content Moderation
          </Typography>
          <Typography component="li" variant="body1" sx={{ mb: 1 }}>
            Analytics & Reports
          </Typography>
          <Typography component="li" variant="body1" sx={{ mb: 1 }}>
            System Settings
          </Typography>
        </Box>

        <Box sx={{ mt: 4, p: 2, bgcolor: 'grey.100', color: 'black', borderRadius: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            Your Role Information:
          </Typography>
          <Typography variant="body2">
            <strong>Role:</strong> {user?.role?.name}
          </Typography>
          <Typography variant="body2">
            <strong>Type:</strong> {user?.role?.type}
          </Typography>
          <Typography variant="body2">
            <strong>Description:</strong> {user?.role?.description}
          </Typography>
        </Box>
      </Paper>
    </Box>
  )
}
