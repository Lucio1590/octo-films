import { useState } from 'react'
import { Typography, Box, Paper, Button, Stack, Tabs, Tab } from '@mui/material'
import { Add, Upload, Category, Movie } from '@mui/icons-material'
import { useAppSelector } from '../../hooks/redux'
import { isAdmin } from '../../utils/auth'
import { Navigate, useNavigate } from 'react-router'
import MovieTable from './MovieTable'
import GenresTable from './GenresTable'
import ImportMoviesDialog from './ImportMoviesDialog'
import ImportGenresDialog from './ImportGenresDialog'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  )
}

export default function Dashboard() {
  const { user } = useAppSelector((state) => state.auth)
  const navigate = useNavigate()
  const [importMoviesDialogOpen, setImportMoviesDialogOpen] = useState(false)
  const [importGenresDialogOpen, setImportGenresDialogOpen] = useState(false)
  const [tabValue, setTabValue] = useState(0)

  // Check if user is logged in and has admin privileges
  if (!isAdmin(user)) {
    return <Navigate to="/films" replace />
  }

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  return (
    <Box sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h3" gutterBottom>
            Admin Dashboard
          </Typography>
        </Box>

        <Typography variant="body1" color="text.secondary" gutterBottom>
          Manage all content in the database below. You can create individual items or import multiple items from JSON
          files.
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="admin dashboard tabs">
            <Tab label="Movies" icon={<Movie />} iconPosition="start" />
            <Tab label="Genres" icon={<Category />} iconPosition="start" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5">Movies Management</Typography>
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<Upload />}
                onClick={() => setImportMoviesDialogOpen(true)}
                data-testid="import-movies-json-btn"
              >
                Import Movies from JSON
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
          <MovieTable />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5">Genres Management</Typography>
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<Upload />}
                onClick={() => setImportGenresDialogOpen(true)}
                data-testid="import-genres-json-btn"
              >
                Import Genres from JSON
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Add />}
                onClick={() => navigate('/create-genre')}
                data-testid="create-genre-btn"
              >
                Create Genre
              </Button>
            </Stack>
          </Box>
          <GenresTable />
        </TabPanel>
      </Paper>

      <ImportMoviesDialog open={importMoviesDialogOpen} onClose={() => setImportMoviesDialogOpen(false)} />
      <ImportGenresDialog open={importGenresDialogOpen} onClose={() => setImportGenresDialogOpen(false)} />
    </Box>
  )
}
