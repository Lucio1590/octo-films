import { createBrowserRouter, Navigate } from 'react-router'
import App from './App'
// Placeholder imports for your film app's pages/components
// Replace these with your actual component paths as you implement them
import LandingPage from './features/landing/HomePage'
import FilmDashboard from './features/films/FilmDashboard'
import FilmsList from './features/films/FilmsList'
import FilmDetailPage from './features/films/FilmDetailPage'
import FilmForm from './features/films/FilmForm'
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
    element: <App />,
    children: [
      {
        element: <RequireAuth />,
        children: [
          { path: 'films', element: <FilmDashboard /> },
          { path: 'films/list', element: <FilmsList /> },
          { path: 'films/:id', element: <FilmDetailPage /> },
          { path: 'create-film', element: <FilmForm key="create" /> },
          { path: 'manage/:id', element: <FilmForm /> },
          { path: 'profile', element: <UserProfile /> },
          { path: 'dashboard', element: <Dashboard /> },
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
