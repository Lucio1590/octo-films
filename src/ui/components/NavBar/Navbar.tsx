import * as React from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import MenuIcon from '@mui/icons-material/Menu'
import Container from '@mui/material/Container'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import MenuItem from '@mui/material/MenuItem'
import { LightMode, DarkMode, Shield } from '@mui/icons-material'
import { useNavigate } from 'react-router'
import NavbarLogo from './NavbarLogo'
import { useAppDispatch, useAppSelector } from '../../../hooks/redux'
import { logoutUser } from '../../../store/slices/authSlice'
import { isAdmin, getUserRole } from '../../../utils/auth'
import { useTheme } from '../../useTheme'

const pages = ['Films', 'Films List', 'Genres']
const adminPages = ['Dashboard', 'Create']

function Navbar() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { user, loading } = useAppSelector((state) => state.auth)
  const { mode, toggleTheme } = useTheme()

  // Safely check if user is admin, ensuring we have complete user data
  const userIsAdmin = React.useMemo(() => {
    return !loading && user && isAdmin(user)
  }, [user, loading])

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null)
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null)

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget)
  }

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }

  const handlePageClick = (page: string) => {
    handleCloseNavMenu()

    switch (page) {
      case 'Films':
        navigate('/films')
        break
      case 'Films List':
        navigate('/films/list')
        break
      case 'Genres':
        navigate('/genres')
        break
      default:
        break
    }
  }

  const handleAdminPageClick = (page: string) => {
    handleCloseNavMenu()

    switch (page) {
      case 'Dashboard':
        navigate('/dashboard')
        break
      case 'Create':
        // Navigate to create film page
        navigate('/create-film')
        break
      default:
        break
    }
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  const handleMenuItemClick = (setting: string) => {
    handleCloseUserMenu()

    switch (setting) {
      case 'Profile':
        navigate('/profile')
        break
      case 'Dashboard':
        navigate('/dashboard')
        break
      case 'Logout':
        dispatch(logoutUser())
        navigate('/')
        break
      default:
        // Handle other menu items
        break
    }
  }

  // Create settings array based on user role
  const settings = [
    { label: 'Profile', action: 'Profile' },
    ...(userIsAdmin ? [{ label: 'Dashboard', action: 'Dashboard' }] : []),
    { label: 'Logout', action: 'Logout' },
  ]

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <NavbarLogo />
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={() => handlePageClick(page)}>
                  <Typography sx={{ textAlign: 'center' }}>{page}</Typography>
                </MenuItem>
              ))}
              {userIsAdmin && (
                <>
                  <MenuItem disabled>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ textAlign: 'center', fontWeight: 'bold' }}
                    >
                      ADMIN
                    </Typography>
                  </MenuItem>
                  {adminPages.map((page) => (
                    <MenuItem key={page} onClick={() => handleAdminPageClick(page)}>
                      <Typography sx={{ textAlign: 'center' }}>{page}</Typography>
                    </MenuItem>
                  ))}
                </>
              )}
            </Menu>
          </Box>
          <NavbarLogo isMobile />
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button key={page} onClick={() => handlePageClick(page)} sx={{ my: 2, display: 'block' }}>
                {page}
              </Button>
            ))}
            {userIsAdmin && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  ml: 2,
                  mr: 1,
                  backgroundColor: mode === 'light' ? 'rgba(26, 35, 126, 0.08)' : 'grey.700',
                  borderRadius: 1,
                  pr: 3,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', ml: 2, mr: 1 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      my: 2,
                      display: 'block',
                      fontWeight: 'bold',
                      ml: 2,
                      mr: 1,
                      whiteSpace: 'pre-wrap',
                      textAlign: 'center',
                      color: mode === 'light' ? 'primary.main' : 'text.secondary',
                    }}
                  >
                    {'ADMIN\nFUNCTIONALITIES'}
                  </Typography>
                  <Shield sx={{ color: mode === 'light' ? 'primary.main' : 'white', verticalAlign: 'middle', mr: 1 }} />
                </Box>

                {adminPages.map((page) => (
                  <Button
                    key={page}
                    onClick={() => handleAdminPageClick(page)}
                    sx={{
                      my: 2,
                      display: 'block',
                      color: mode === 'light' ? 'primary.main' : 'white',
                      borderRadius: 0,
                      ml: 1,
                      pl: 2,
                      '&:hover': {
                        backgroundColor: mode === 'light' ? 'rgba(26, 35, 126, 0.08)' : 'rgba(255, 255, 255, 0.08)',
                      },
                    }}
                  >
                    {page}
                  </Button>
                ))}
              </Box>
            )}
          </Box>
          <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Theme Toggle Button */}
            <Tooltip title={mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}>
              <IconButton
                onClick={toggleTheme}
                color="inherit"
                sx={{
                  color: mode === 'light' ? 'primary.main' : 'white',
                  '&:hover': {
                    backgroundColor: mode === 'light' ? 'rgba(26, 35, 126, 0.08)' : 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                {mode === 'light' ? <DarkMode /> : <LightMode />}
              </IconButton>
            </Tooltip>

            {/* User Avatar and Menu */}
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt={user?.username || 'User'} sx={{ bgcolor: 'secondary.main' }}>
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {/* User info header */}
              <MenuItem disabled>
                <Box>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {user?.username}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {user?.email}
                  </Typography>
                  <Typography variant="caption" color="primary.main" sx={{ display: 'block' }}>
                    {getUserRole(user)}
                  </Typography>
                </Box>
              </MenuItem>

              {/* Menu items */}
              {settings.map((setting) => (
                <MenuItem
                  key={setting.label}
                  onClick={() => handleMenuItemClick(setting.action)}
                  sx={{
                    color: setting.action === 'Logout' ? 'error.main' : 'inherit',
                  }}
                >
                  <Typography sx={{ textAlign: 'center' }}>{setting.label}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default Navbar
