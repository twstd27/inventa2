import { legacy_createStore as createStore, combineReducers, applyMiddleware, compose } from 'redux'
import { authReducer } from './reducers/authReducer'
import { thunk } from 'redux-thunk'
import { uiReducer } from './reducers/uiReducer'
import { marcasReducer } from './reducers/marcasReducer'
import { categoriasReducer } from './reducers/categoriasReducer'
import { productosReducer } from './reducers/productosReducer'
import { sucursalesReducer } from './reducers/sucursalesReducer'
import { stockReducer } from './reducers/stockReducer'
import { ventasReducer } from './reducers/ventasReducer'
import { usuariosReducer } from './reducers/usuariosReducer'
import { rolesReducer } from './reducers/rolesReducer'
import { cotizacionesReducer } from './reducers/cotizacionesReducer'
import { layoutReducer } from './reducers/layoutReducer'

const composeEnhancers =
  (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose

const reducers = combineReducers({
  auth: authReducer,
  ui: uiReducer,
  marcas: marcasReducer,
  categorias: categoriasReducer,
  productos: productosReducer,
  sucursales: sucursalesReducer,
  stock: stockReducer,
  ventas: ventasReducer,
  cotizaciones: cotizacionesReducer,
  usuarios: usuariosReducer,
  roles: rolesReducer,
  layout: layoutReducer,
})

const store = createStore(reducers, composeEnhancers(applyMiddleware(thunk)))

export default store

// const initialState = {
//   sidebarShow: true,
//   theme: 'light',
// }

// const changeState = (state = initialState, { type, ...rest }) => {
//   switch (type) {
//     case 'set':
//       return { ...state, ...rest }
//     default:
//       return state
//   }
// }

// const store = createStore(changeState)
// export default store
