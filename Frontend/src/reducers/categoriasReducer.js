import {types} from "../types/types";

const initialState = {
  categorias: [],
  categoria: {
    name: '',
    description: ''
  }
}

export const categoriasReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.categorias.setCategorias:
      return{
        ...state,
        categorias: action.payload.categorias,
      }
    case types.categorias.setCategoriasCombo:
      return{
        ...state,
        categoriasCombo: action.payload.categorias,
      }
    case types.categorias.setCategoria:
      return{
        ...state,
        categoria: action.payload.categoria,
      }
    case types.categorias.setError:
      return{
        ...state,
        error: action.payload.error
      }
    case types.categorias.resetModal:
      return {
        ...state,
        error: {
          status: '',
          message: '',
          errors: []
        },
        categoria: {
          name: '',
          description: ''
        }
      }
    default:
      return state;
  }
}
