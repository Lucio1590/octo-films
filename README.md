# Octo Films

This is Luciand Diaconu's repo. (S00000724)

### Live Demo
You can view the live demo of Octo Films at [Octo Films Live Demo](https://octo-films.lucio.website).


Octo Films is a React Single Page Application (SPA) that allows users to rate films they have viewed. Users can browse a list of movies, add their own ratings, and keep track of their film-watching history in a simple and intuitive interface.


## Important Note for the PROFESSOR
Please note that this project to run locally for sequrity reasons requires the api url to be set in the `.env` file. The `.env.example` file provides a template for the required environment variables.
In the comments on the platform, I have provided the API URL that you can use to run the project locally.

### Secondary Note
The registration functionality in production enviroment is disabled for security reasons. However, you can still log in with the provided credentials in the comments of the submission platform.




## Running Locally

To run this React app locally:

1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Start the development server:**
   ```sh
   npm run dev
   ```
3. Open your browser and go to [http://localhost:3000](http://localhost:3000) to view the app.

---

## Features Overview

See [Features.md](./Features.md) for a detailed list of features, requirements, user roles, and main pages included in Octo Films.

### Import Movies from JSON

Admin users can import multiple movies from TMDB JSON files. 
This feature allows:
- Bulk import of movies from TMDB API responses
- Real-time progress tracking
- Error handling for invalid or duplicate entries
- Automatic mapping from TMDB format to backend Movie format

See [IMPORT_GUIDE.md](./IMPORT_GUIDE.md) for detailed instructions on using this feature.

This feature was implemented to facilitate the addition of movies to the database, especially for the online demo version, where manually adding movies would be time-consuming.

## Development Process

First of all, a prototype for Octo Films was created in Figma. You can view the design and user flow here:

[Figma Prototype – Octo Films](https://www.figma.com/design/dPeA6lGy8tOHCLZoJPKRDv/Octo-Films?node-id=0-1&t=chQnjXG8pvWHCI9Y-1)

This prototype served as the foundation for the application's UI and user experience before development began.
Not all features from the prototype were implemented, but the core functionality remains intact.

## API Definition
The API for Octo Films is defined in the [API.md](./API.md) file. It includes endpoints for:
 - User authentication and management
 - Movie management (CRUD operations)
 - Review management (CRUD operations)
 - Importing movies from TMDB JSON files


## Database Schema
![Entity Relation Schema](<Octo Films - ER.png>)

The database schema for Octo Films is designed to support the application's features and user roles. It includes tables for:
- Users: Stores user information and roles (regular user or admin)
- Movies: Stores movie details, including title, description, release date, and images
- Reviews: Stores user reviews for movies, including rating and text
- Genres: Stores movie genres for filtering and categorization


## Technologies Used
- **React**: For building the user interface
- **React Router**: For client-side routing
- **Redux**: For state management
- **Redux Toolkit**: For simplifying Redux setup and usage
- **Redux Thunk**: For handling asynchronous actions
- **Material UI**: For pre-built React components and styling
- **Axios**: For making HTTP requests to the backend API
- **zod**: For form validation and error handling



## Special Thanks to the following resources:
- [React Documentation](https://react.dev/)
- [React Router Documentation](https://reactrouter.com/en/main)
- [Redux Documentation](https://redux.js.org/)
- [Redux Thunk Documentation](https://github.com/reduxjs/redux-thunk)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [Material UI Documentation](https://mui.com/)
- [Axios Documentation](https://axios-http.com/docs/intro)
- [dbdiagram.io](https://dbdiagram.io/) for visualizing and designing the application's database schema