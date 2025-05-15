import {types} from "../types/types";

const initialState = {
  sucursales: [],
  sucursal: {
    name: '',
    address: '',
    phone: ''
  }
}

export const sucursalesReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.sucursales.setSucursales:
      return{
        ...state,
        sucursales: action.payload.sucursales,
      }
    case types.sucursales.setSucursalesCombo:
      return{
        ...state,
        sucursalesCombo: action.payload.sucursales,
      }
    case types.sucursales.setSucursal:
      return{
        ...state,
        sucursal: action.payload.sucursal,
      }
    case types.sucursales.setError:
      return{
        ...state,
        error: action.payload.error
      }
    case types.sucursales.resetModal:
      return {
        ...state,
        error: {
          status: '',
          message: '',
          errors: []
        },
        sucursal: {
          name: '',
          address: '',
          phone: ''
        }
      }
    default:
      return state;
  }
}
