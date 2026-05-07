import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../stores/useAuthStore'

export const PrivateRoutes = ({ allowedRoles = null }) => {
  const { logged, usuario } = useAuthStore()
  const hasToken = !!localStorage.getItem('token')

  if (!logged || !hasToken) return <Navigate to="/login" />
  if (allowedRoles && !allowedRoles.includes(usuario?.role_id)) return <Navigate to="/404" />
  return <Outlet />
}

export default PrivateRoutes
