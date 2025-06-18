import { Navigate, Outlet, useLocation } from 'react-router'
import { useAppSelector } from '../../hooks/redux'

export default function RequireAuth() {
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Outlet />
}
