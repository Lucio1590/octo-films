import { Box, FormControl, InputLabel, MenuItem, Select, Typography, type SelectChangeEvent } from '@mui/material'
import { useAppSelector } from '../../api'

interface FilmSortingProps {
  handleSortFieldChange: (event: SelectChangeEvent) => void
  handleSortDirectionChange: (event: SelectChangeEvent) => void
}

const FilmSorting = ({ handleSortFieldChange, handleSortDirectionChange }: FilmSortingProps) => {
  const { sort } = useAppSelector((state) => state.movies)

  return (
    <Box display="flex" gap={2} mb={2} alignItems="center" p={2}>
      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
        Sort by:
      </Typography>
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Field</InputLabel>
        <Select value={sort.field} label="Field" onChange={handleSortFieldChange}>
          <MenuItem value="title">Title</MenuItem>
          <MenuItem value="release_date">Release Date</MenuItem>
        </Select>
      </FormControl>
      <FormControl size="small" sx={{ minWidth: 100 }}>
        <InputLabel>Order</InputLabel>
        <Select value={sort.direction} label="Order" onChange={handleSortDirectionChange}>
          <MenuItem value="asc">Ascending</MenuItem>
          <MenuItem value="desc">Descending</MenuItem>
        </Select>
      </FormControl>
    </Box>
  )
}
export default FilmSorting
