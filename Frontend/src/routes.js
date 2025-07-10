import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Marcas = React.lazy(() => import('./views/marcas/AdministrarMarcas'))
const Categorias = React.lazy(() => import('./views/categorias/AdministrarCategorias'))
const Productos = React.lazy(() => import('./views/productos/AdministrarProductos'))
const Sucursales = React.lazy(() => import('./views/sucursales/AdministrarSucursales'))
const Entradas = React.lazy(() => import('./views/stock/AdministrarEntradas'))
const Salidas = React.lazy(() => import('./views/stock/AdministrarSalidas'))
const POS = React.lazy(() => import('./views/ventas/POS'))
const Cotizaciones = React.lazy(() => import('./views/ventas/Cotizaciones'))
const Reportes = React.lazy(() => import('./views/ventas/Reportes'))
const Usuarios = React.lazy(() => import('./views/usuarios/AdministrarUsuarios'))
const Roles = React.lazy(() => import('./views/roles/AdministrarRoles'))
const ParametrosGenerales = React.lazy(() => import('./views/administrar/ParametrosGenerales'))
const ListaPrecios = React.lazy(() => import('./views/precios/AdministrarPrecios'))
const QRScanner = React.lazy(() => import('./views/productos/qr'))
const Etiquetas = React.lazy(() => import('./views/productos/AdministrarEtiquetas'))

const routes = [
  { path: '/', exact: true, name: 'Home', element: Dashboard },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/panel', name: 'Panel', element: Dashboard },
  { path: '/usuarios', name: 'Usuarios', element: Usuarios },
  { path: '/roles', name: 'Usuarios', element: Roles },
  { path: '/productos', name: 'Productos', element: Productos },
  { path: '/categorias', name: 'Categorias', element: Categorias },
  { path: '/marcas', name: 'Marcas', element: Marcas },
  { path: '/sucursales', name: 'Sucursales', element: Sucursales },
  { path: '/entradas', name: 'Entradas', element: Entradas },
  { path: '/salidas', name: 'Salidas', element: Salidas },
  { path: '/POS', name: 'POS', element: POS },
  { path: '/cotizaciones', name: 'Cotizaciones', element: Cotizaciones },
  { path: '/reportes', name: 'Reportes de Ventas', element: Reportes },
  { path: '/parametros', name: 'Parametros Generales', element: ParametrosGenerales },
  // { path: '/listaprecios', name: 'Lista de Precios', element: ListaPrecios },
  { path: '/qr-scanner', name: 'Escaner QR', element: QRScanner },
  { path: '/etiquetas', name: 'Etiquetas', element: Etiquetas },
]

export default routes
