import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../stores/useAuthStore'

export const PrivateRoutes = ({ allowedRoles = null }) => {
  const { logged, usuario } = useAuthStore()
  if (!logged) return <Navigate to="/login" />
  if (allowedRoles && !allowedRoles.includes(usuario?.role_id)) return <Navigate to="/404" />
  return <Outlet />
}

export default PrivateRoutes
