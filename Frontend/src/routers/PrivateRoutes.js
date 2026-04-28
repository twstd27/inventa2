import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../stores/useAuthStore'

export const PrivateRoutes = ({ allowedRoles = null }) => {
  const { logged, usuario } = useAuthStore()

  const token = localStorage.getItem('token')
  const expiresAt = localStorage.getItem('token_expires_at')
  const tokenValid = token && (!expiresAt || Date.now() < new Date(expiresAt).getTime())

  if (!logged || !tokenValid) return <Navigate to="/login" />
  if (allowedRoles && !allowedRoles.includes(usuario?.role_id)) return <Navigate to="/404" />
  return <Outlet />
}

export default PrivateRoutes
