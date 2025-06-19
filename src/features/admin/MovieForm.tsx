import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Box, Button, TextField, Alert, Stack } from '@mui/material'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { createMovie, updateMovieByDocumentId, fetchMovieByDocumentId } from '../../store/slices/moviesSlice'
import { useNavigate, useParams } from 'react-router'
import { useState, useEffect } from 'react'

const movieSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  release_date: z.string().min(4, 'Release date is required'),
  average_rating: z.number().min(0).max(10),
  cover_image: z.string().url('Cover image must be a valid URL').or(z.literal('')).optional(),
  background_image: z.string().url('Background image must be a valid URL').or(z.literal('')).optional(),
})

type MovieFormData = z.infer<typeof movieSchema>

export default function MovieForm() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { loading, error, currentMovie } = useAppSelector((state) => state.movies)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const isEditMode = Boolean(id)
  const documentId = id // Use documentId directly from URL parameter

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue,
  } = useForm<MovieFormData>({
    resolver: zodResolver(movieSchema),
    mode: 'onChange',
    defaultValues: {
      average_rating: 0,
    },
  })

  // Load movie data for editing
  useEffect(() => {
    if (isEditMode && documentId) {
      dispatch(fetchMovieByDocumentId({ documentId }))
    }
  }, [dispatch, isEditMode, documentId])

  // Populate form when movie data is loaded
  useEffect(() => {
    if (isEditMode && currentMovie) {
      setValue('title', currentMovie.title)
      setValue('description', currentMovie.description)
      setValue('release_date', currentMovie.release_date)
      setValue('average_rating', currentMovie.average_rating)
      setValue('cover_image', currentMovie.cover_image || '')
      setValue('background_image', currentMovie.background_image || '')
    }
  }, [isEditMode, currentMovie, setValue])

  const onSubmit = async (data: MovieFormData) => {
    setSubmitError(null)
    try {
      if (isEditMode && documentId) {
        await dispatch(updateMovieByDocumentId({ documentId, data })).unwrap()
      } else {
        await dispatch(createMovie(data)).unwrap()
      }
      reset()
      navigate('/dashboard')
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : `Failed to ${isEditMode ? 'update' : 'create'} film`)
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack spacing={2}>
        <TextField
          label="Title"
          {...register('title')}
          error={!!errors.title}
          helperText={errors.title?.message}
          fullWidth
        />
        <TextField
          label="Description"
          {...register('description')}
          error={!!errors.description}
          helperText={errors.description?.message}
          multiline
          minRows={3}
          fullWidth
        />
        <TextField
          label="Release Date"
          type="date"
          {...register('release_date')}
          error={!!errors.release_date}
          helperText={errors.release_date?.message}
          fullWidth
        />
        <TextField
          label="Average Rating"
          type="number"
          {...register('average_rating', { valueAsNumber: true })}
          error={!!errors.average_rating}
          helperText={errors.average_rating?.message}
          inputProps={{ min: 0, max: 10, step: 0.1 }}
          fullWidth
        />
        <TextField
          label="Cover Image URL"
          {...register('cover_image')}
          error={!!errors.cover_image}
          helperText={errors.cover_image?.message}
          fullWidth
        />
        <TextField
          label="Background Image URL"
          {...register('background_image')}
          error={!!errors.background_image}
          helperText={errors.background_image?.message}
          fullWidth
        />
        {submitError && <Alert severity="error">{submitError}</Alert>}
        {error && (
          <Alert severity="error">
            {typeof error === 'string' ? error : `Failed to ${isEditMode ? 'update' : 'create'} film.`}
          </Alert>
        )}
        <Button type="submit" variant="contained" color="primary" disabled={!isValid || loading}>
          {loading ? (isEditMode ? 'Updating...' : 'Creating...') : isEditMode ? 'Update Film' : 'Create Film'}
        </Button>
      </Stack>
    </Box>
  )
}
