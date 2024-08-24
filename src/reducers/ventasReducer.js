import {types} from "../types/types";

const initialState = {
  ventas: [],
  diario: [],
  venta: {
    branch_id: '',
    doc_date: '',
    comments: '',
    branch: {},
    sale_details: []
  },
  ventaImp: {
    branch_id: '',
    doc_date: '',
    comments: '',
    branch: {},
    sale_details: []
  }
}

export const ventasReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.ventas.setVentas:
      return{
        ...state,
        ventas: action.payload.ventas,
      }
    case types.ventas.setVenta:
      return{
        ...state,
        venta: action.payload.venta,
      }
    case types.ventas.setVentaImp:
      return{
        ...state,
        ventaImp: action.payload.venta,
      }
    case types.ventas.setError:
      return{
        ...state,
        error: action.payload.error
      }
    case types.ventas.resetModal:
      return {
        ...state,
        error: {
          status: '',
          message: '',
          errors: []
        },
        venta: {
          branch_id: '',
          doc_date: '',
          comments: '',
          branch: {},
          sale_details: []
        }
      }
    case types.ventas.setDiario:
      return{
        ...state,
        diario: action.payload.registros,
      }
    default:
      return state;
  }
}
