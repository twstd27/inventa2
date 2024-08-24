import {types} from "../types/types";

const initialState = {
  usuarios: [],
  usuario: {
    name: '',
    lastname: '',
    email: '',
    phone: '',
    role_id: '',
    rol: ''
  }
}

export const usuariosReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.usuarios.setUsuarios:
      return{
        ...state,
        usuarios: action.payload.usuarios,
      }
    case types.usuarios.setUsuario:
      return{
        ...state,
        usuario: action.payload.usuario,
      }
    case types.usuarios.setError:
      return{
        ...state,
        error: action.payload.error
      }
    case types.usuarios.resetModal:
      return {
        ...state,
        error: {
          status: '',
          message: '',
          errors: []
        },
        usuario: {
          name: '',
          lastname: '',
          email: '',
          phone: '',
          role_id: '',
          rol: ''
        }
      }
    default:
      return state;
  }
}
