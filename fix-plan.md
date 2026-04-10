# Plan de Correcciones — InVenta2 Frontend
> Ordenado por riesgo e impacto. Cada fix es atómico y testeable antes de seguir.

---

## Baseline antes de empezar

```bash
npm run build   # debe compilar sin errores
```
Ese es el punto de referencia. Si algo rompe después de un fix, se revierte ese commit.

**Estrategia de commits:** Un commit por fix. Un branch por fase. No mezclar fases en el mismo PR.

---

## FASE 1 — Bugs críticos (hacer primero, sin excepción)

---

### Fix 1.1 — Reducer duplicado en `uiReducer.js`

**Archivo:** `src/reducers/uiReducer.js`

**Qué hacer:**
- Eliminar el segundo bloque `case types.ui.openVentasDialog` (el que está cerca del `default`). El primero es el válido.
- Corregir typo: `dialogProductOpen` → `dialogProductosOpen` en los cases `openDialog` y `closeDialog` (no coincide con el `initialState` que tiene `dialogProductosOpen`).

**Qué testear:**
- Abrir y cerrar cualquier modal/dialog de la app
- Abrir DevTools Redux → despachar `[UI] Open Ventas Dialog` → confirmar que `dialogVentasOpen` cambia a `true`

---

### Fix 1.2 — Memory leak en `AppHeader.js`

**Archivo:** `src/components/AppHeader.js`

**Qué hacer:** Agregar cleanup al event listener de scroll.

```js
// ANTES
useEffect(() => {
  document.addEventListener('scroll', () => {
    headerRef.current &&
      headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0)
  })
}, [])

// DESPUÉS
useEffect(() => {
  const handleScroll = () => {
    headerRef.current &&
      headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0)
  }
  document.addEventListener('scroll', handleScroll)
  return () => document.removeEventListener('scroll', handleScroll)
}, [])
```

**Qué testear:**
- Navegar entre rutas y hacer scroll — la sombra del header debe aparecer/desaparecer normalmente

---

### Fix 1.3 — Sesión persistente + manejo de JWT

Este es el fix más importante. Tocar 3 archivos en el mismo commit.

**Archivos:** `src/actions/authAction.js`, `src/reducers/authReducer.js`, `src/store.js`

**Nuevo archivo:** `src/helpers/axiosInstance.js` (base para Fase 2)

**Paso A — `axiosInstance.js` (nuevo archivo):**
```js
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // se configura en Fix 2.1
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('usuario')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
```

**Paso B — `authAction.js`:** Guardar token y usuario al hacer login, limpiarlos al hacer logout.
```js
// En startLogin, dentro del if (response.data.status === 'ok'):
const { usuario, token } = response.data.data
localStorage.setItem('token', token)
localStorage.setItem('usuario', JSON.stringify(usuario))
dispatch(login(usuario, true))

// En startLogout:
localStorage.removeItem('token')
localStorage.removeItem('usuario')
// ... resto del código existente
```

> **Nota:** Verificar en Network tab el nombre exacto del campo token que devuelve el API (puede ser `token`, `access_token`, etc.)

**Paso C — `store.js`:** Hidratar el store con el estado guardado en localStorage.
```js
const loadState = () => {
  try {
    const token = localStorage.getItem('token')
    const usuario = localStorage.getItem('usuario')
    if (!token || !usuario) return undefined
    return {
      auth: {
        logged: true,
        usuario: JSON.parse(usuario),
      }
    }
  } catch {
    return undefined
  }
}

const store = createStore(reducers, loadState(), composeEnhancers(applyMiddleware(thunk)))
```

**Qué testear:**
- Login → F5 → el usuario sigue logueado
- Logout → revisar Application > LocalStorage → `token` y `usuario` deben desaparecer
- Network tab → las requests deben incluir `Authorization: Bearer <token>`

---

### Fix 1.4 — Eliminar `console.log` de datos sensibles en producción

**Archivos afectados** (buscar con `console.log(error` en todo el proyecto):
- `src/actions/cotizacionesAction.js`
- `src/actions/productosAction.js`
- `src/actions/stockAction.js`
- `src/actions/usuariosAction.js`
- `src/actions/ventasAction.js`
- `src/actions/authAction.js`

**Qué hacer:** Reemplazar todos los `console.log(error.response)` con:
```js
if (import.meta.env.DEV) {
  console.error('[dev]', error?.response?.status, error?.response?.data?.message)
}
```

Vite elimina esto del bundle de producción automáticamente porque reemplaza `import.meta.env.DEV` con `false`.

**Qué testear:**
- `npm run build` → buscar `console.log` en el bundle generado → debe haber 0 resultados
- En desarrollo: forzar un error de red → confirmar que el log safe aparece

---

### Fix 1.5 — Race condition en el estado `loading`

**Archivo:** `src/reducers/uiReducer.js`, `src/helpers/selectors.js` (nuevo)

**Qué hacer:** Cambiar el boolean `loading` por un contador.

En `initialState`:
```js
loadingCount: 0,
```

En los cases:
```js
case types.ui.startLoading:
  return { ...state, loadingCount: state.loadingCount + 1 }
case types.ui.finishLoading:
  return { ...state, loadingCount: Math.max(0, state.loadingCount - 1) }
```

Crear `src/helpers/selectors.js`:
```js
export const selectLoading = (state) => state.ui.loadingCount > 0
```

En todos los componentes que usan `loading`, cambiar:
```js
// ANTES
const { loading } = useSelector((state) => state.ui)
// DESPUÉS
const loading = useSelector(selectLoading)
```

Componentes a actualizar: `Login.js`, `POS.js`, `DialogVentas.js`, y cualquier otro que lea `state.ui.loading`.

**Qué testear:**
- En POS, cargar productos mientras el selector de sucursal también está cargando
- El spinner debe mantenerse activo hasta que AMBAS requests terminen

---

## FASE 2 — Seguridad (después de Fase 1 completa)

---

### Fix 2.1 — API URL a variables de entorno

**Archivos:** `src/types/types.js`, crear `Frontend/.env`, agregar a `.gitignore`

**Crear `Frontend/.env`:**
```
VITE_API_URL=https://api.sublimack.com
VITE_DISK_URL=https://api.sublimack.com/storage/images
```

**Modificar `types.js`:**
```js
// Eliminar URLs hardcodeadas y URLs comentadas de otros clientes
export const API = import.meta.env.VITE_API_URL
export const DISK = import.meta.env.VITE_DISK_URL
```

**Agregar a `.gitignore`:**
```
.env
.env.production
```

Crear `Frontend/.env.example` con valores placeholder (este SÍ va al repo):
```
VITE_API_URL=https://your-api-url
VITE_DISK_URL=https://your-api-url/storage/images
```

**Qué testear:**
- `npm start` → Network tab → requests van a la URL correcta
- `git diff types.js` → no debe contener ningún dominio de cliente

---

### Fix 2.2 — Eliminar credenciales de prueba en `Login.js`

**Archivo:** `src/views/pages/login/Login.js`

**Qué hacer:** Eliminar las líneas comentadas con email y password de prueba. Nada más.

**Qué testear:** Login funciona normalmente.

---

### Fix 2.3 — Migrar todos los action files a la instancia centralizada de Axios

**Prerequisito:** Fix 1.3 (axiosInstance creada) y Fix 2.1 (env variables) deben estar completos.

**Archivos:** Los 15 archivos en `src/actions/`

**Por cada archivo, hacer:**
1. Reemplazar `import axios from 'axios'` → `import api from '../helpers/axiosInstance'`
2. Reemplazar `axios.get(API + '/ruta')` → `api.get('/ruta')`
3. Reemplazar `axios.post(API + '/ruta', data)` → `api.post('/ruta', data)`
4. Eliminar el import de `API` de `types.js` (ya no se necesita porque `axiosInstance` tiene el `baseURL`)

**Orden de migración (uno a la vez, testear entre cada uno):**
1. `ventasAction.js` — el más crítico, si este funciona el resto es mecánico
2. `productosAction.js`
3. `stockAction.js`
4. Resto en un batch: `authAction`, `categoriasAction`, `cotizacionesAction`, `layoutAction`, `marcasActions`, `paramsAction`, `preciosAction`, `rolesAction`, `sucursalesAction`, `tipoDeCambioAction`, `uiAction`, `usuariosAction`

**Qué testear después de cada archivo:**
- Network tab: la request del módulo migrado incluye `Authorization: Bearer <token>`
- La funcionalidad del módulo (lista, creación, edición) funciona igual que antes

---

### Fix 2.4 — Protección de rutas por rol (RBAC básico)

**Archivos:** `src/routers/PrivateRoutes.js`, `src/routers/AppRouter.js`

**Modificar `PrivateRoutes.js`:**
```js
export const PrivateRoutes = ({ allowedRoles = null }) => {
  const { logged, usuario } = useSelector((state) => state.auth)
  if (!logged) return <Navigate to="/login" />
  if (allowedRoles && !allowedRoles.includes(usuario?.role_id)) {
    return <Navigate to="/404" />
  }
  return <Outlet />
}
```

**Modificar `AppRouter.js`:** Envolver las rutas admin-only en su propio `Route`:
```jsx
// Rutas que requieren role_id = 1 (admin)
<Route element={<PrivateRoutes allowedRoles={[1]} />}>
  <Route path="/usuarios" element={<Usuarios />} />
  <Route path="/roles" element={<Roles />} />
  <Route path="/sucursales" element={<Sucursales />} />
  <Route path="/parametros" element={<Parametros />} />
  <Route path="/tipo-de-cambio" element={<TipoDeCambio />} />
</Route>
```

> Verificar el `role_id` real del admin contra la base de datos antes de hardcodear el `1`.

**Qué testear:**
- Usuario no-admin → navegar manualmente a `/usuarios` → debe redirigir a `/404`
- Usuario admin → acceso normal a todas las rutas
- Logout y re-login como admin → confirma acceso

---

## FASE 3 — Arquitectura (planificar para sprints futuros)

---

### Fix 3.1 — Migrar store a Redux Toolkit

**Archivo:** `src/store.js`

```bash
npm install @reduxjs/toolkit
```

```js
import { configureStore } from '@reduxjs/toolkit'

const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    // ... resto igual
  },
  preloadedState: loadState(), // del Fix 1.3
})
```

`redux-thunk` ya viene incluido en RTK, se puede desinstalar por separado.

**Qué testear:** App entera — login, navegación, todas las operaciones CRUD.

---

### Fix 3.2 — Dividir `POS.js` (868 líneas)

**Archivos a crear:**
```
src/views/ventas/pos/
  ProductSearchPanel.js   — columna izquierda: búsqueda y grilla de productos
  SaleDetailPanel.js      — columna derecha: lineas, totales, botón vender
  usePOSState.js          — custom hook con toda la lógica y estados
```

**`POS.js`** queda como orquestador delgado que solo compone los tres anteriores.

**Estrategia:** Extraer de a un componente a la vez, testeando el POS completo después de cada extracción.

---

## Lista de mejoras (nice-to-have)

Estas no son urgentes pero mejoran significativamente la experiencia de desarrollo y de usuario.

### DX (Developer Experience)
- [ ] **ESLint `no-console` en producción**: agregar `"no-console": ["error", { allow: ["warn", "error"] }]` al config de ESLint para que el lint falle si alguien agrega un `console.log`
- [ ] **Archivo `.env.example`** con placeholders commiteado al repo — nuevo dev sabe qué variables necesita
- [ ] **Prettier config** (`.prettierrc`) — ya está instalado pero sin config, el formateo es inconsistente entre archivos
- [ ] **PropTypes** en componentes críticos si no se va a TypeScript — al menos en modales y POS

### UX (User Experience)
- [ ] **Toasts en todas las mutaciones** — actualmente solo el POS muestra feedback. Agregar toasts en crear/editar/eliminar productos, usuarios, categorías, etc.
- [ ] **Skeletons de carga** — reemplazar el spinner genérico con skeletons del contenido que va a aparecer (tablas, tarjetas)
- [ ] **Filtro visual del sidebar por rol** — los items admin del menú no deberían mostrarse a usuarios no-admin (la ruta ya está protegida, esto es defensa en profundidad en la UI)
- [ ] **Confirmación antes de eliminar** — agregar dialog de confirmación en las acciones destructivas (delete de producto, usuario, etc.)
- [ ] **Loading por módulo** — con el sistema de contador de Fix 1.5, se puede ir más lejos: loading states específicos por módulo para que el grid de productos y el selector de sucursal tengan sus propios indicadores

### Seguridad
- [ ] **Manejo explícito de 401** — el interceptor de axios del Fix 1.3 ya lo cubre, pero agregar feedback al usuario ("tu sesión expiró") en lugar de simplemente redirigir
- [ ] **Refresh tokens** — si el backend lo soporta, implementar renovación automática de tokens antes de que expiren

### Arquitectura
- [ ] **Migrar reducers a `createSlice` de RTK** — después de Fix 3.1, migrar reducer por reducer. Elimina la mitad del boilerplate. Empezar con `authReducer` como piloto
- [ ] **RTK Query** para fetching de datos — reemplaza el patrón `action + loading + reducer` con queries declarativas que manejan cache, loading y errores automáticamente. Es un cambio grande pero valdría la pena para módulos nuevos
- [ ] **TypeScript** — renombrar archivos `.js` → `.ts`/`.tsx` de a uno. Empezar por `types/types.js` (constantes), luego reducers, luego actions, luego componentes
- [ ] **Completar o eliminar `Register.js`** — la página de registro existe con UI pero sin lógica. Si no se va a usar, borrarla para evitar confusión

---

## Resumen de dependencias entre fixes

```
Fix 1.1  ──── independiente
Fix 1.2  ──── independiente
Fix 1.3  ──┐
Fix 1.4  ──┤ independientes entre sí
Fix 1.5  ──┘
              │
Fix 2.1  ────┤ prereq para Fix 2.3
Fix 2.2  ──── independiente
Fix 2.3  ←── necesita Fix 1.3 + Fix 2.1
Fix 2.4  ──── independiente (pero mejor después de Fix 1.3 para tener usuario en store)
              │
Fix 3.1  ──── independiente (instalar RTK, no rompe nada)
Fix 3.2  ──── independiente (refactor puro de POS.js)
```

---

*Plan generado: Abril 2026. Revisar antes de ejecutar si el API cambió.*
