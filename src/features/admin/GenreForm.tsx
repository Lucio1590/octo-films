import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Box, Button, TextField, Alert, Stack } from '@mui/material'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { createGenre, updateGenreByDocumentId, fetchGenreByDocumentId } from '../../store/slices/genresSlice'
import { useNavigate, useParams } from 'react-router'
import { useState, useEffect } from 'react'

const genreSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name must be 50 characters or less'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(50, 'Slug must be 50 characters or less')
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
})

type GenreFormData = z.infer<typeof genreSchema>

export default function GenreForm() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { loading, error, currentGenre } = useAppSelector((state) => state.genres)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const isEditMode = Boolean(id)
  const documentId = id // Use documentId directly from URL parameter

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue,
    watch,
  } = useForm<GenreFormData>({
    resolver: zodResolver(genreSchema),
    mode: 'onChange',
  })

  const nameValue = watch('name')

  // Auto-generate slug from name
  useEffect(() => {
    if (nameValue && !isEditMode) {
      const slug = nameValue
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
      setValue('slug', slug)
    }
  }, [nameValue, isEditMode, setValue])

  // Load genre data for editing
  useEffect(() => {
    if (isEditMode && documentId) {
      dispatch(fetchGenreByDocumentId({ documentId }))
    }
  }, [dispatch, isEditMode, documentId])

  // Populate form when genre data is loaded
  useEffect(() => {
    if (isEditMode && currentGenre) {
      setValue('name', currentGenre.name)
      setValue('slug', currentGenre.slug)
    }
  }, [isEditMode, currentGenre, setValue])

  const onSubmit = async (data: GenreFormData) => {
    setSubmitError(null)
    try {
      if (isEditMode && documentId) {
        await dispatch(updateGenreByDocumentId({ documentId, data })).unwrap()
      } else {
        await dispatch(createGenre(data)).unwrap()
      }
      reset()
      navigate('/dashboard')
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : `Failed to ${isEditMode ? 'update' : 'create'} genre`)
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack spacing={2}>
        <TextField
          label="Name"
          {...register('name')}
          error={!!errors.name}
          helperText={errors.name?.message}
          fullWidth
          placeholder="e.g., Science Fiction"
        />
        <TextField
          label="Slug"
          {...register('slug')}
          error={!!errors.slug}
          helperText={errors.slug?.message || 'URL-friendly identifier (lowercase, hyphens allowed)'}
          fullWidth
          placeholder="e.g., science-fiction"
        />
        {submitError && <Alert severity="error">{submitError}</Alert>}
        {error && (
          <Alert severity="error">
            {typeof error === 'string' ? error : `Failed to ${isEditMode ? 'update' : 'create'} genre.`}
          </Alert>
        )}
        <Button type="submit" variant="contained" color="primary" disabled={!isValid || loading}>
          {loading ? (isEditMode ? 'Updating...' : 'Creating...') : isEditMode ? 'Update Genre' : 'Create Genre'}
        </Button>
      </Stack>
    </Box>
  )
}
