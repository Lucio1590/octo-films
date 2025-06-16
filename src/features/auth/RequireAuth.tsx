import { Navigate, Outlet, useLocation } from 'react-router'
export default function RequireAuth() {
  const isAuthenticated = true // TODO: replace with actual authentication logic
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} />
  }

  return <Outlet />
}
