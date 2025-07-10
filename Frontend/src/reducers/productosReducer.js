import { types } from '../types/types'

const initialState = {
  productos: [],
  productosEtiqueta: [],
  paginaActual: 1,
  ultimaPagina: 1,
  totalProductos: 0,
  producto: {
    code: '',
    name: '',
    price: 0,
    price_discount: 0,
    price_wholesome: 0,
    price_type: 0,
    cost: 0,
    description: '',
    brand_id: '',
    marca: '',
    price_percent: 0,
    wholesome_percent: 0,
    discount_percent: 0,
    cost_usd: 0,
    images: [],
    categories: [],
  },
}

export const productosReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.productos.setProductos:
      return {
        ...state,
        productos: action.payload.productos,
        paginaActual: action.payload.paginaActual,
        ultimaPagina: action.payload.ultimaPagina,
        totalProductos: action.payload.totalProductos,
      }
    case types.productos.setProductosEtiqueta:
      return {
        ...state,
        productosEtiqueta: action.payload.productosEtiqueta,
      }
    case types.productos.setProductosCombo:
      return {
        ...state,
        productosCombo: action.payload.productos,
      }
    case types.productos.setProducto:
      return {
        ...state,
        producto: action.payload.producto,
      }
    case types.productos.setError:
      return {
        ...state,
        error: action.payload.error,
      }
    case types.productos.resetModal:
      return {
        ...state,
        error: {
          status: '',
          message: '',
          errors: [],
        },
        producto: {
          code: '',
          name: '',
          price: 0,
          price_discount: 0,
          price_wholesome: 0,
          cost: 0,
          images: [],
          description: '',
          brand_id: '',
          marca: '',
          categories: [],
        },
      }
    case types.productos.resetProductos:
      return {
        ...state,
        productos: [],
      }
    default:
      return state
  }
}
