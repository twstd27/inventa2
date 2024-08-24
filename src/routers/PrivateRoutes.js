import React from 'react'
import PropTypes from 'prop-types'
import { Outlet, Navigate } from 'react-router-dom'

export const PrivateRoutes = ({ isLogged, component: Component, ...rest }) => {
  return isLogged ? <Outlet /> : <Navigate to="/login" />
  // return <Route {...rest} element={isLogged ? <Component {...rest} /> : <Navigate to="/login" />} />
}

PrivateRoutes.propTypes = {
  isLogged: PropTypes.bool.isRequired,
}
