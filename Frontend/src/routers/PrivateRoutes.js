import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

export const PrivateRoutes = () => {
  const { logged } = useSelector((state) => state.auth)
  return logged ? <Outlet /> : <Navigate to="/login" />
}

export default PrivateRoutes
