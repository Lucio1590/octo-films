import React, { useState, useRef } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  LinearProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  Chip,
  IconButton,
} from '@mui/material'
import { CloudUpload, Close, CheckCircle, Error } from '@mui/icons-material'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { importGenresFromJSON, clearGenreImportProgress, fetchGenres } from '../../store/slices/genresSlice'

interface ImportGenresDialogProps {
  open: boolean
  onClose: () => void
}

export default function ImportGenresDialog({ open, onClose }: ImportGenresDialogProps) {
  const dispatch = useAppDispatch()
  const { importing, importProgress, error } = useAppSelector((state) => state.genres)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [importComplete, setImportComplete] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.type === 'application/json' || file.name.endsWith('.json')) {
        setSelectedFile(file)
        setImportComplete(false)
      } else {
        alert('Please select a valid JSON file')
      }
    }
  }

  const handleImport = async () => {
    if (!selectedFile) return

    try {
      const fileContent = await selectedFile.text()
      await dispatch(importGenresFromJSON(fileContent)).unwrap()
      setImportComplete(true)
      // Refresh the genres list to show the newly imported genres
      dispatch(fetchGenres({ sort: 'name:asc', pageSize: 50 }))
    } catch (error) {
      console.error('Import failed:', error)
    }
  }

  const handleClose = () => {
    if (!importing) {
      setSelectedFile(null)
      setImportComplete(false)
      dispatch(clearGenreImportProgress())
      onClose()
    }
  }

  const getProgressPercentage = () => {
    if (!importProgress) return 0
    return Math.round(((importProgress.completed + importProgress.failed) / importProgress.total) * 100)
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth disableEscapeKeyDown={importing}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Import Genres from JSON</Typography>
        <IconButton onClick={handleClose} disabled={importing}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Upload a JSON file containing genre categories. The file should contain an array of genre names or an object
            with a "categories" array.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Expected formats: <code>{`{"categories": ["Action", "Comedy", ...]}`}</code> or{' '}
            <code>{`["Action", "Comedy", ...]`}</code>
          </Typography>
        </Box>

        {!importing && !importComplete && (
          <Box sx={{ mb: 3 }}>
            <input
              type="file"
              accept=".json,application/json"
              onChange={handleFileSelect}
              ref={fileInputRef}
              style={{ display: 'none' }}
            />
            <Button
              variant="outlined"
              startIcon={<CloudUpload />}
              onClick={() => fileInputRef.current?.click()}
              fullWidth
              sx={{ mb: 2 }}
            >
              Choose JSON File
            </Button>
            {selectedFile && (
              <Alert severity="info" sx={{ mb: 2 }}>
                Selected file: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
              </Alert>
            )}
          </Box>
        )}

        {importing && importProgress && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Importing Genres...
            </Typography>
            <LinearProgress
              variant="determinate"
              value={getProgressPercentage()}
              sx={{ mb: 2, height: 8, borderRadius: 4 }}
            />
            <Box display="flex" gap={2} mb={2}>
              <Chip
                icon={<CheckCircle />}
                label={`Completed: ${importProgress.completed}`}
                color="success"
                variant="outlined"
              />
              <Chip icon={<Error />} label={`Failed: ${importProgress.failed}`} color="error" variant="outlined" />
              <Chip label={`Total: ${importProgress.total}`} variant="outlined" />
            </Box>
            <Typography variant="body2" color="text.secondary">
              Progress: {importProgress.completed + importProgress.failed} of {importProgress.total} genres processed
            </Typography>
          </Box>
        )}

        {importComplete && importProgress && (
          <Box sx={{ mb: 3 }}>
            <Alert severity="success" sx={{ mb: 2 }}>
              Import completed! {importProgress.completed} genres imported successfully.
            </Alert>

            {importProgress.failed > 0 && (
              <Box>
                <Typography variant="h6" gutterBottom color="error">
                  Failed Imports ({importProgress.failed})
                </Typography>
                <List dense>
                  {importProgress.errors.map((error, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={error} primaryTypographyProps={{ variant: 'body2', color: 'error' }} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={importing}>
          {importComplete ? 'Close' : 'Cancel'}
        </Button>
        {!importing && !importComplete && (
          <Button variant="contained" onClick={handleImport} disabled={!selectedFile} startIcon={<CloudUpload />}>
            Import Genres
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}
