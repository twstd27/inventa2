import {types} from "../types/types";

const initialState = {
  entradas: [],
  salidas: [],
  entrada: {
    branch_id: '',
    type: '',
    doc_date: '',
    comments: '',
    branch: {},
    entry_details: []
  }
}

export const stockReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.entradas.setEntradas:
      return{
        ...state,
        entradas: action.payload.entradas,
      }
    case types.salidas.setSalidas:
      return{
        ...state,
        salidas: action.payload.salidas,
      }
    case types.entradas.setEntrada:
      return{
        ...state,
        entrada: action.payload.entrada,
      }
    case types.entradas.setError:
      return{
        ...state,
        error: action.payload.error
      }
    case types.entradas.resetModal:
      return {
        ...state,
        error: {
          status: '',
          message: '',
          errors: []
        },
        entrada: {
          branch_id: '',
          type: '',
          date: '',
          comments: '',
          branch: {},
          entry_details: []
        }
      }
    default:
      return state;
  }
}
