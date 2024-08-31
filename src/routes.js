import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Marcas = React.lazy(() => import('./views/marcas/AdministrarMarcas'))
const Categorias = React.lazy(() => import('./views/categorias/AdministrarCategorias'))
const Productos = React.lazy(() => import('./views/productos/AdministrarProductos'))
const Sucursales = React.lazy(() => import('./views/sucursales/AdministrarSucursales'))
const Stock = React.lazy(() => import('./views/stock/AdministrarEntradas'))
const POS = React.lazy(() => import('./views/ventas/POS'))
const Cotizaciones = React.lazy(() => import('./views/ventas/Cotizaciones'))
const Reportes = React.lazy(() => import('./views/ventas/Reportes'))
const Usuarios = React.lazy(() => import('./views/usuarios/AdministrarUsuarios'))
const Roles = React.lazy(() => import('./views/roles/AdministrarRoles'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/panel', name: 'Panel', element: Dashboard },
  { path: '/usuarios', name: 'Usuarios', element: Usuarios },
  { path: '/roles', name: 'Usuarios', element: Roles },
  { path: '/productos', name: 'Productos', element: Productos },
  { path: '/categorias', name: 'Categorias', element: Categorias },
  { path: '/marcas', name: 'Marcas', element: Marcas },
  { path: '/sucursales', name: 'Sucursales', element: Sucursales },
  { path: '/entradas', name: 'Entradas', element: Stock },
  { path: '/salidas', name: 'Salidas', element: Stock },
  { path: '/POS', name: 'POS', element: POS },
  { path: '/cotizaciones', name: 'Cotizaciones', element: Cotizaciones },
  { path: '/reportes', name: 'Reportes de Ventas', element: Reportes },
]

export default routes
