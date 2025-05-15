import {types} from "../types/types";

const initialState = {
  marcas: [],
  marca: {
    name: '',
    description: ''
  }
}

export const marcasReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.marcas.setMarcas:
      return{
        ...state,
        marcas: action.payload.marcas,
      }
    case types.marcas.setMarcasCombo:
      return{
        ...state,
        marcasCombo: action.payload.marcas,
      }
    case types.marcas.setMarca:
      return{
        ...state,
        marca: action.payload.marca,
      }
    case types.marcas.setError:
      return{
        ...state,
        error: action.payload.error
      }
    case types.marcas.resetModal:
      return {
        ...state,
        error: {
          status: '',
          message: '',
          errors: []
        },
        marca: {
          name: '',
          description: ''
        }
      }
    default:
      return state;
  }
}
