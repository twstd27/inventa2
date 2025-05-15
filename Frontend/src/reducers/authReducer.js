import {types} from "../types/types";
// const logeado = (!(sessionStorage.getItem('logged') !== undefined && sessionStorage.getItem('logged') !== null));
// console.log(logeado);

const initialState = {
  logged: false, //cambiar antes de enviar a produccion
  usuario: {
    // id: '1',
    // name: 'admin',
    // lastname: 'admin',
    // permissions: [{"value":"todos","label":"Todos los módulos"}],
    id: '',
    name: '',
    lastname: '',
    permissions: [],
    email: '',
    phone: '',
    role_id: ''
  }
}

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.auth.login:
      return{
        ...state,
        usuario: action.payload.usuario,
        logged: action.payload.logged
      }
    case types.auth.logout:
      return {
        ...state,
        logged: action.payload.logged
      }
    case types.auth.setError:
      return{
        ...state,
        error: action.payload.error
      }
    default:
      return state;
  }
}
