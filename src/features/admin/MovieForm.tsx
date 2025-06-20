import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Box, Button, TextField, Alert, Stack, Autocomplete, Chip } from '@mui/material'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { createMovie, updateMovieByDocumentId, fetchMovieByDocumentId } from '../../store/slices/moviesSlice'
import { fetchGenres } from '../../store/slices/genresSlice'
import { useNavigate, useParams } from 'react-router'
import { useState, useEffect } from 'react'
import type { Genre } from '../../core/types/genre'
import type { Movie } from '../../core/types/movie'

const movieSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  release_date: z.string().min(4, 'Release date is required'),
  average_rating: z.number().min(0).max(10),
  cover_image: z.string().url('Cover image must be a valid URL').or(z.literal('')).optional(),
  background_image: z.string().url('Background image must be a valid URL').or(z.literal('')).optional(),
  genres: z
    .array(
      z.object({
        id: z.number(),
        documentId: z.string(),
        name: z.string(),
        slug: z.string(),
        createdAt: z.string(),
        updatedAt: z.string(),
        publishedAt: z.string(),
      }),
    )
    .optional(),
})

type MovieFormData = z.infer<typeof movieSchema>

// Type for API payload where genres are just documentId strings
type MovieCreateUpdateData = Omit<MovieFormData, 'genres'> & {
  genres?: string[]
}

export default function MovieForm() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { loading, error, currentMovie } = useAppSelector((state) => state.movies)
  const { genres } = useAppSelector((state) => state.genres)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const isEditMode = Boolean(id)
  const documentId = id // Use documentId directly from URL parameter

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue,
    control,
  } = useForm<MovieFormData>({
    resolver: zodResolver(movieSchema),
    mode: 'onChange',
    defaultValues: {
      average_rating: 0,
      genres: [],
    },
  })

  // Load genres for the multiselect
  useEffect(() => {
    dispatch(fetchGenres({ sort: 'name:asc', pageSize: 100, page: 1 }))
  }, [dispatch])

  // Load movie data for editing
  useEffect(() => {
    if (isEditMode && documentId) {
      dispatch(fetchMovieByDocumentId({ documentId, populate: 'genres' }))
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
      setValue('genres', currentMovie.genres || [])
    }
  }, [isEditMode, currentMovie, setValue])

  const onSubmit = async (data: MovieFormData) => {
    setSubmitError(null)
    try {
      // Transform genres to only include documentIds for the API
      const transformedData: MovieCreateUpdateData = {
        ...data,
        genres: data.genres?.map((genre) => genre.documentId) || [],
      }

      if (isEditMode && documentId) {
        await dispatch(updateMovieByDocumentId({ documentId, data: transformedData as Partial<Movie> })).unwrap()
      } else {
        await dispatch(createMovie(transformedData as Partial<Movie>)).unwrap()
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
        <Controller
          name="genres"
          control={control}
          render={({ field: { onChange, value, ...field } }) => (
            <Autocomplete
              {...field}
              multiple
              options={genres}
              value={value || []}
              onChange={(_, newValue) => onChange(newValue)}
              getOptionLabel={(option: Genre) => option.name}
              isOptionEqualToValue={(option: Genre, value: Genre) => option.documentId === value.documentId}
              renderTags={(value: Genre[], getTagProps) =>
                value.map((option: Genre, index: number) => (
                  <Chip variant="outlined" label={option.name} {...getTagProps({ index })} key={option.documentId} />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Genres"
                  placeholder="Select genres..."
                  error={!!errors.genres}
                  helperText={errors.genres?.message}
                />
              )}
            />
          )}
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
