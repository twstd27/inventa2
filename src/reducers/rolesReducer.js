import {types} from "../types/types";

const initialState = {
  modulos: [
    {
      value: 'POS',
      label: 'POS',
      modulo: 'ventas'
    },
    {
      value: 'cotizaciones',
      label: 'Cotizaciones',
      modulo: 'ventas'
    },
    {
      value: 'reportes',
      label: 'Reportes',
      modulo: 'ventas'
    },
    {
      value: 'productos',
      label: 'Administrar (Productos)',
      modulo: 'productos'
    },
    {
      value: 'categorias',
      label: 'Categorias',
      modulo: 'productos'
    },
    {
      value: 'marcas',
      label: 'Marcas',
      modulo: 'productos'
    },
    {
      value: 'stock',
      label: 'Entradas de mercancía',
      modulo: 'stock'
    },
    {
      value: 'usuarios',
      label: 'Usuarios',
      modulo: 'parametros'
    },
    {
      value: 'roles',
      label: 'Roles',
      modulo: 'parametros'
    },
    {
      value: 'sucursales',
      label: 'Sucursales',
      modulo: 'parametros'
    },
    {
      value: 'todos',
      label: 'Todos los módulos'
    },
  ],
  roles: [],
  error: {
    status: '',
    message: '',
    errors: []
  },
  rol: {
    name: '',
    permissions: '',
  }
}

export const rolesReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.roles.setRoles:
      return{
        ...state,
        roles: action.payload.roles,
      }
    case types.roles.setRolesCombo:
      return{
        ...state,
        rolesCombo: action.payload.roles,
      }
    case types.roles.setRol:
      return{
        ...state,
        rol: action.payload.rol,
      }
    case types.roles.setError:
      return{
        ...state,
        error: action.payload.error
      }
    case types.roles.resetModal:
      return {
        ...state,
        error: {
          status: '',
          message: '',
          errors: []
        },
        rol: {
          name: '',
          permissions: '',
        }
      }
    default:
      return state;
  }
}
