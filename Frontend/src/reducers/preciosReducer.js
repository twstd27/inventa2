import { types } from '../types/types'

const initialState = {
  precios: [],
  precio: {
    name: '',
    percent: 0,
  },
}

export const preciosReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.precios.setPrecios:
      return {
        ...state,
        precios: action.payload.precios,
      }
    case types.precios.setPreciosCombo:
      return {
        ...state,
        preciosCombo: action.payload.precios,
      }
    case types.precios.setPrecio:
      return {
        ...state,
        precio: action.payload.precio,
      }
    case types.precios.setError:
      return {
        ...state,
        error: action.payload.error,
      }
    case types.precios.resetModal:
      return {
        ...state,
        error: {
          status: '',
          message: '',
          errors: [],
        },
        precio: {
          name: '',
          percent: 0,
        },
      }
    default:
      return state
  }
}
