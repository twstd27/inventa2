//export const API = 'http://api.sblimportadora.com/public';
export const API = 'http://localhost:8000'
export const DISK = 'https://inventa-sblimportadora.s3.sa-east-1.amazonaws.com/images'

export const types = {
  auth: {
    login: '[Auth] Login',
    logout: '[Auth] Logout',
    setError: '[Auth] Set Error',
  },
  usuarios: {
    setUsuarios: '[Usuarios] Obtener Usuarios',
    setUsuario: '[Usuarios] Obtener Usuario',
    deleteUsuario: '[Usuarios] Borrar Usuario',
    restoreUsuario: '[Usuarios] Restaurar Usuario',
    setError: '[Usuarios] Set Error',
    resetModal: '[Usuarios] Reset Modal',
  },
  ui: {
    startLoading: '[UI] Start Loading',
    finishLoading: '[UI] Finish Loading',
    openModal: '[UI] Open Modal',
    openProductosModal: '[UI] Open Productos Modal',
    openVentasModal: '[UI] Open Ventas Modal',
    openCotizacionesModal: '[UI] Open Cotizaciones Modal',
    modalProductoEtiquetaOpen: '[UI] Open Etiqueta Producto Modal',
    closeModal: '[UI] Close Modal',
    openDialog: '[UI] Open Dialog',
    openProductosDialog: '[UI] Open Productos Dialog',
    openVentasDialog: '[UI] Open Ventas Dialog',
    openCotizacionesDialog: '[UI] Open Cotizaciones Dialog',
    closeDialog: '[UI] Close Dialog',
    reset: '[UI] Reset',
  },
  marcas: {
    setMarcas: '[Marcas] Obtener Marcas',
    setMarcasCombo: '[Marcas] Obtener Marcas Combo',
    setMarca: '[Marcas] Obtener Marca',
    deleteMarca: '[Marcas] Borrar Marca',
    restoreMarca: '[Marcas] Restaurar Marca',
    setError: '[Marcas] Set Error',
    resetModal: '[Marcas] Reset Modal',
  },
  categorias: {
    setCategorias: '[Categorias] Obtener Categorias',
    setCategoriasCombo: '[Categorias] Obtener Categorias Combo',
    setCategoria: '[Categorias] Obtener Categoria',
    deleteCategoria: '[Categorias] Borrar Categoria',
    restoreCategoria: '[Categorias] Restaurar Categoria',
    setError: '[Categorias] Set Error',
    resetModal: '[Categorias] Reset Modal',
  },
  productos: {
    setProductos: '[Productos] Obtener Productos',
    setProductosCombo: '[Productos] Obtener Productos Combo',
    setProducto: '[Productos] Obtener Producto',
    deleteProducto: '[Productos] Borrar Producto',
    restoreProducto: '[Productos] Restaurar Producto',
    setError: '[Productos] Set Error',
    resetModal: '[Productos] Reset Modal',
    resetProductos: '[Productos] Reset Productos',
  },
  sucursales: {
    setSucursales: '[Sucursales] Obtener Sucursales',
    setSucursalesCombo: '[Sucursales] Obtener Sucursales Combo',
    setSucursal: '[Sucursales] Obtener Sucursal',
    deleteSucursal: '[Sucursales] Borrar Sucursal',
    restoreSucursal: '[Sucursales] Restaurar Sucursal',
    setError: '[Sucursales] Set Error',
    resetModal: '[Sucursales] Reset Modal',
  },
  entradas: {
    setEntradas: '[Entradas] Obtener Entradas',
    setEntrada: '[Entradas] Obtener Entrada',
    deleteEntrada: '[Entradas] Borrar Entrada',
    restoreEntrada: '[Entradas] Restaurar Entrada',
    setError: '[Entradas] Set Error',
    resetModal: '[Entradas] Reset Modal',
  },
  salidas: {
    setSalidas: '[Salidas] Obtener Salidas',
  },
  ventas: {
    setVentas: '[Ventas] Obtener Ventas',
    setVenta: '[Ventas] Obtener Venta',
    setVentaImp: '[Ventas] Obtener Venta Impresión',
    setError: '[Ventas] Set Error',
    resetModal: '[Ventas] Reset Modal',
    setDiario: '[Ventas] Obtener Registro Diario',
  },
  cotizaciones: {
    setCotizaciones: '[Cotizaciones] Obtener Cotizaciones',
    setCotizacion: '[Cotizaciones] Obtener Cotizacion',
    setCotizacionImp: '[Cotizaciones] Obtener Cotizacion Impresión',
    setError: '[Cotizaciones] Set Error',
    resetModal: '[Cotizaciones] Reset Modal',
  },
  roles: {
    setRoles: '[Roles] Obtener Roles',
    setRolesCombo: '[Roles] Obtener Roles Combo',
    setRol: '[Roles] Obtener Rol',
    deleteRol: '[Roles] Borrar Rol',
    restoreRol: '[Roles] Restaurar Rol',
    setError: '[Roles] Set Error',
    resetModal: '[Roles] Reset Modal',
  },
  layout: {
    toggleSidebar: '[Layout] Mostrar Sidebar',
    changeTheme: '[Layout] Cambiar Tema',
  },
}
