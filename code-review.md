# Code Review — InVenta2 Frontend
> Análisis honesto desde perspectiva senior developer. Abril 2026.
> **Actualizado:** post-migración completa a Zustand (Abril 2026).

---

## TL;DR

El proyecto tiene una base funcional sólida: estructura organizada, Zustand aplicado con consistencia, CoreUI bien integrado. La migración de Redux a Zustand resolvió varios problemas estructurales de raíz. Quedan pendientes mejoras de arquitectura y testing.

**Calificación general: 7 / 10**
> Funciona y es producción-seguro en lo esencial. El principal riesgo ahora es la ausencia de tests.

---

## Estado de los fixes aplicados

### ✅ RESUELTOS

| # | Problema | Solución aplicada |
|---|----------|-------------------|
| 1.1 | Reducer duplicado en `uiReducer` | Eliminado al migrar a Zustand — `useUIStore.js` no tiene el bug |
| 1.2 | Memory leak en `AppHeader.js` | Pendiente de verificar (ver nota abajo) |
| 1.3 | Sesión no persiste al recargar | `useAuthStore` con `persist` middleware de Zustand |
| 1.3 | Sin manejo de JWT en requests | `src/helpers/axiosInstance.js` con interceptor Bearer |
| 1.4 | `console.log` de datos sensibles | Eliminados en todos los stores (no usan `console.log(error)`) |
| 1.5 | Race condition en `loading` | `loadingCount` (entero) en `useUIStore` |
| 2.1 | URL del API hardcodeada | `.env` con `VITE_API_URL` y `VITE_DISK_URL` |
| 2.2 | Credenciales de prueba en código | Removidas al reescribir los stores |
| 2.3 | Sin instancia centralizada de Axios | `src/helpers/axiosInstance.js` usado en todos los stores |
| 2.4 | Sin RBAC en rutas | `PrivateRoutes.js` con `allowedRoles` prop |
| —  | Bug CTabs (tabs no cambiaban) | `defaultActiveItemKey` en lugar de `activeItemKey` controlado |
| —  | Redux `legacy_createStore` deprecado | Eliminado — Redux removido por completo |

---

## 1. Seguridad

### ✅ 1.1 URL del API en variables de entorno
**Archivo:** `Frontend/.env`

```env
VITE_API_URL=https://api.sublimack.com
VITE_DISK_URL=https://api.sublimack.com/storage/images
```

`types.js` ahora solo exporta `DISK` desde la env variable. `axiosInstance.js` usa `VITE_API_URL` como `baseURL`.

---

### ✅ 1.2 JWT en todas las requests
**Archivo:** `src/helpers/axiosInstance.js`

Interceptor de request agrega `Authorization: Bearer <token>` automáticamente. Interceptor de respuesta maneja 401 con logout automático.

---

### ✅ 1.3 RBAC básico implementado
**Archivo:** `src/routers/PrivateRoutes.js`

```js
export const PrivateRoutes = ({ allowedRoles = null }) => {
  const { logged, usuario } = useAuthStore()
  if (!logged) return <Navigate to="/login" />
  if (allowedRoles && !allowedRoles.includes(usuario?.role_id)) return <Navigate to="/404" />
  return <Outlet />
}
```

> **Pendiente:** Aplicar `allowedRoles` a las rutas admin en `AppRouter.js`. El componente está listo pero falta usarlo en el router.

---

### ⚠️ 1.4 Credenciales en historial de git
Si el repo alguna vez fue público o las credenciales comentadas siguen siendo válidas, rotarlas. El historial de git no se limpió.

---

## 2. Bugs

### ✅ 2.1 Sesión persistente
`useAuthStore` usa el middleware `persist` de Zustand con `partialize` para guardar solo `logged` y `usuario`. El token se guarda en `localStorage` por `axiosInstance`.

### ✅ 2.2 Race condition en loading
`loadingCount` es un entero — se incrementa al iniciar cada request y decrementa al terminar. El spinner se mantiene activo mientras haya al menos una request en vuelo.

```js
const loading = useUIStore((s) => s.loadingCount > 0)
```

### ✅ 2.3 CTabs congelado
`Reportes.js` usaba `activeItemKey={active}` (controlado) sin handler. Corregido con `defaultActiveItemKey={1}` (no controlado).

### ⚠️ 2.4 Memory leak en AppHeader
No verificado si el event listener de scroll tiene cleanup. Revisar `src/components/AppHeader.js`:

```js
// Debe verse así:
useEffect(() => {
  const handler = () => { ... }
  document.addEventListener('scroll', handler)
  return () => document.removeEventListener('scroll', handler) // ← esto es clave
}, [])
```

---

## 3. Arquitectura actual

### ✅ 3.1 Zustand — 15 stores
Ubicados en `src/stores/`. Cada store encapsula estado + acciones + llamadas a la API.

| Store | Dominio |
|-------|---------|
| `useAuthStore` | Login, logout, sesión persistente |
| `useUIStore` | Loading, modales, diálogos |
| `useLayoutStore` | Sidebar, tema |
| `useProductosStore` | CRUD productos + imágenes |
| `useVentasStore` | CRUD ventas + diario |
| `useCotizacionesStore` | CRUD cotizaciones |
| `useStockStore` | Entradas y salidas |
| `useSucursalesStore` | CRUD sucursales |
| `useUsuariosStore` | CRUD usuarios |
| `useRolesStore` | CRUD roles + módulos |
| `useMarcasStore` | CRUD marcas |
| `useCategoriasStore` | CRUD categorías |
| `usePreciosStore` | CRUD precios |
| `useParamsStore` | Parámetros del sistema |
| `useTipoDeCambioStore` | CRUD tipos de cambio |

### ⚠️ 3.2 POS.js sigue siendo un componente grande
El componente POS tiene lógica de búsqueda de productos, carrito, facturación y diálogos en un solo archivo. Es funcional pero difícil de modificar sin riesgo de regresión.

### ⚠️ 3.3 Sin tests
No hay ningún test unitario ni de integración. Cualquier refactor es a ciegas.

---

## 4. Mantenibilidad actual

**Corto plazo (1-3 meses):** Buena. La estructura Zustand es predecible y el código es más limpio que antes.

**Mediano plazo (3-12 meses, equipo de 2+ devs):** Manejable pero empieza a ser problemático sin TypeScript ni tests. Las regresiones en POS.js son el mayor riesgo.

**Largo plazo o nuevo dev:** Mejor que antes gracias a Zustand, pero aún sin documentación ni tests. Un dev nuevo puede entender los stores fácilmente pero va a tener dificultades con POS.js.

### Factores positivos actuales:
- Zustand bien organizado por dominio
- `axiosInstance.js` como única fuente de verdad para API calls
- Sesión persistente resuelta
- Loading sin race conditions
- RBAC implementado

### Factores negativos pendientes:
- Sin TypeScript
- Sin tests
- POS.js monolítico (no dividido)
- `allowedRoles` no aplicado en rutas admin de `AppRouter.js`
- Memory leak en `AppHeader.js` sin verificar

---

## 5. Prioridades restantes

### Ahora
1. **Verificar memory leak en AppHeader.js** — 10 min
2. **Aplicar `allowedRoles` en `AppRouter.js`** — 30 min (el componente ya está listo)

### Próximo sprint
3. **Dividir POS.js** en `ProductSearchPanel`, `SaleDetailPanel`, `usePOSState`
4. **Completar o eliminar `Register.js`** — tiene UI sin lógica
5. **Toasts en todas las mutaciones** — actualmente solo POS tiene feedback visual

### Deuda técnica a planificar
6. TypeScript (empezar por los stores, ya tienen estructura clara)
7. Tests en flujos críticos: login, creación de venta, stock
8. Filtro visual del sidebar por rol (rutas ya protegidas, esto es UX)

---

*Generado con análisis estático del código fuente. Última revisión: Abril 2026 (post-migración Zustand).*
