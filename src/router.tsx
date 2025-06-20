import { createBrowserRouter, Navigate } from 'react-router'
import App from './App'
import LandingPage from './features/landing/HomePage'
import FilmsHome from './features/films/FilmsHome'
import FilmsList from './features/films/FilmsList'
import FilmDetailPage from './features/films/FilmDetailPage'
import GenresPage from './features/films/GenresPage'
import MovieFormPage from './features/admin/MovieFormPage'
import GenreFormPage from './features/admin/GenreFormPage'
import UserProfile from './features/account/UserProfile'
import LoginForm from './features/account/LoginForm'
import RegisterForm from './features/account/RegisterForm'
import Dashboard from './features/admin/Dashboard'
import NotFound from './features/errors/NotFound'
import ServerError from './features/errors/ServerError'
import RequireAuth from './features/auth/RequireAuth'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // App renders <Outlet /> for children
    children: [
      {
        element: <RequireAuth />, // All protected routes
        children: [
          { path: 'dashboard', element: <Dashboard /> }, // Admin dashboard
          { path: 'films', element: <FilmsHome /> },
          { path: 'films/list', element: <FilmsList /> },
          { path: 'films/:id', element: <FilmDetailPage /> },
          { path: 'genres', element: <GenresPage /> }, // Genres with top movies
          { path: 'create-film', element: <MovieFormPage /> }, // Create film (admin)
          { path: 'manage/:id', element: <MovieFormPage /> }, // Edit film (admin)
          { path: 'create-genre', element: <GenreFormPage /> }, // Create genre (admin)
          { path: 'manage-genre/:id', element: <GenreFormPage /> }, // Edit genre (admin)
          { path: 'profile', element: <UserProfile /> },
        ],
      },
      { path: '', element: <LandingPage /> },
      { path: 'login', element: <LoginForm /> },
      { path: 'register', element: <RegisterForm /> },
      { path: 'not-found', element: <NotFound /> },
      { path: 'server-error', element: <ServerError /> },
      { path: '*', element: <Navigate replace to="/not-found" /> },
    ],
  },
])
