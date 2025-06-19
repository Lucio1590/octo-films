# NOTE:

This feature in not requested but since i wanted to have my own backend for the app, I had to implement it to be able to add movies faster and easier, since i was adding them in the local database but then in the online demo version there were no movies to show i wanted a faster way to add movies to the online database.

# Import Movies from JSON Feature

This feature allows admin users to import multiple movies from TMDB JSON files into the Octo Films database.

## How to Use

1. **Access the Admin Dashboard**: Log in with an admin account and navigate to `/dashboard`

2. **Click "Import from JSON"**: In the admin dashboard, click the "Import from JSON" button (outlined button with upload icon)

3. **Select JSON File**: Choose a JSON file containing TMDB movie data. The file should be in one of these formats:
   - TMDB API response format: `{ "results": [movie1, movie2, ...] }`
   - Direct array format: `[movie1, movie2, ...]`
   - Single movie object: `{ id: 1, title: "Movie", ... }`

4. **Import Movies**: Click "Import Movies" to start the process. You'll see:
   - Progress bar showing import status
   - Count of completed, failed, and total movies
   - Real-time updates as each movie is processed

5. **Review Results**: After completion, you'll see:
   - Success message with count of imported movies
   - List of any errors that occurred during import
   - Movies list will automatically refresh to show new films

## JSON Format Requirements

Each movie object in the JSON should contain these required fields:
- `id`: number (TMDB movie ID)
- `title`: string (movie title)
- `overview`: string (movie description)
- `release_date`: string (YYYY-MM-DD format)
- `vote_average`: number (rating 0-10)

Optional fields that will be mapped if present:
- `poster_path`: string (poster image path, will be converted to full TMDB URL)
- `backdrop_path`: string (backdrop image path, will be converted to full TMDB URL)

## Field Mapping

TMDB fields are automatically mapped to the backend Movie format:
- `title` → `title`
- `overview` → `description`
- `release_date` → `release_date`
- `vote_average` → `average_rating`
- `poster_path` → `cover_image` (with TMDB base URL)
- `backdrop_path` → `background_image` (with TMDB base URL)

## Error Handling

- Invalid JSON files will be rejected
- Movies missing required fields will be skipped
- Network errors during upload will be logged
- Partial imports are supported (some movies may succeed while others fail)
- All errors are displayed in the dialog after import completion

## Testing

A sample JSON file is included in the project root: [sample-movies.json](./sample-movies.json)

This file contains 3 sample movies (The Matrix, Inception, Interstellar) in the correct TMDB format for testing the import functionality.

