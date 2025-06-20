import { Box, Paper, Typography, Avatar, Chip, Divider, Card, CardContent } from '@mui/material'
import { Person, Email, Shield, CalendarToday } from '@mui/icons-material'
import { useAppSelector } from '../../hooks/redux'
import { getUserRole } from '../../utils/auth'

export default function UserProfile() {
  const { user } = useAppSelector((state) => state.auth)

  if (!user) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" color="error">
          No user data available
        </Typography>
      </Box>
    )
  }

  const userRole = getUserRole(user)
  const joinDate = new Date(user.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
        My Profile
      </Typography>

      {/* Main Profile Card */}
      <Paper elevation={3} sx={{ p: 4, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: 'primary.main',
              fontSize: '2rem',
              mr: 3,
            }}
          >
            {user.username.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
              {user.username}
            </Typography>
            <Chip
              label={userRole}
              color={userRole === 'Admin' ? 'secondary' : 'primary'}
              icon={userRole === 'Admin' ? <Shield /> : <Person />}
              variant="outlined"
            />
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Profile Information Grid */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
          <Card variant="outlined">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Person sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Username
                </Typography>
              </Box>
              <Typography variant="body1" color="text.secondary">
                {user.username}
              </Typography>
            </CardContent>
          </Card>

          <Card variant="outlined">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Email sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Email Address
                </Typography>
              </Box>
              <Typography variant="body1" color="text.secondary">
                {user.email}
              </Typography>
            </CardContent>
          </Card>

          <Card variant="outlined">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Shield sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Role
                </Typography>
              </Box>
              <Typography variant="body1" color="text.secondary">
                {userRole}
              </Typography>
            </CardContent>
          </Card>

          <Card variant="outlined">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CalendarToday sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Member Since
                </Typography>
              </Box>
              <Typography variant="body1" color="text.secondary">
                {joinDate}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Paper>

      {/* Additional Information */}
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
          Account Information
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Your account was created on {joinDate} and you have {userRole.toLowerCase()} privileges.
        </Typography>
        {userRole === 'Admin' && (
          <Typography variant="body2" color="secondary.main">
            As an administrator, you have access to the admin dashboard and can manage movies and other content.
          </Typography>
        )}
      </Paper>
    </Box>
  )
}
