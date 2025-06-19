import { createBrowserRouter, Navigate } from 'react-router'
import App from './App'
import LandingPage from './features/landing/HomePage'
import FilmDashboard from './features/films/FilmDashboard'
import FilmsList from './features/films/FilmsList'
import FilmDetailPage from './features/films/FilmDetailPage'
import MovieForm from './features/admin/MovieForm'
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
          { path: 'films', element: <FilmDashboard /> },
          { path: 'films/list', element: <FilmsList /> },
          { path: 'films/:id', element: <FilmDetailPage /> },
          { path: 'create-film', element: <MovieForm /> }, // Create film (admin)
          { path: 'manage/:id', element: <MovieForm /> }, // Edit film (admin)
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
