import {types} from "../types/types";

const initialState = {
  cotizaciones: [],
  cotizacion: {
    customer: '',
    branch_id: '',
    doc_date: '',
    comments: '',
    branch: {},
    quotation_details: []
  },
  cotizacionImp: {
    customer: '',
    branch_id: '',
    doc_date: '',
    comments: '',
    branch: {},
    quotation_details: []
  }
}

export const cotizacionesReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.cotizaciones.setCotizaciones:
      return{
        ...state,
        cotizaciones: action.payload.cotizaciones,
      }
    case types.cotizaciones.setCotizacion:
      return{
        ...state,
        cotizacion: action.payload.cotizacion,
      }
    case types.cotizaciones.setCotizacionImp:
      return{
        ...state,
        cotizacionImp: action.payload.cotizacion,
      }
    case types.cotizaciones.setError:
      return{
        ...state,
        error: action.payload.error
      }
    case types.cotizaciones.resetModal:
      return {
        ...state,
        error: {
          status: '',
          message: '',
          errors: []
        },
        venta: {
          customer: '',
          branch_id: '',
          doc_date: '',
          comments: '',
          branch: {},
          quotation_details: []
        }
      }
    default:
      return state;
  }
}
