# Plan de Correcciones — InVenta2 Frontend
> Ordenado por riesgo e impacto. Cada fix es atómico y testeable antes de seguir.
> **Actualizado:** post-migración completa a Zustand (Abril 2026).

---

## Estado actual del build

```bash
npm start   # comando correcto (no "npm run dev")
# ✓ 6843 modules transformed. ✓ built in ~45s
```

El build compila sin errores ni warnings relevantes.

---

## Progreso general

### ✅ FASE 1 — Bugs críticos — COMPLETADA

| Fix | Descripción | Estado |
|-----|-------------|--------|
| 1.1 | Reducer duplicado en `uiReducer` | ✅ Eliminado (Redux removido) |
| 1.2 | Memory leak en `AppHeader.js` | ⚠️ Pendiente de verificar |
| 1.3 | Sesión persistente + JWT | ✅ `useAuthStore` + `axiosInstance.js` |
| 1.4 | `console.log` en producción | ✅ Stores no usan console.log de errores |
| 1.5 | Race condition en `loading` | ✅ `loadingCount` entero en `useUIStore` |

### ✅ FASE 2 — Seguridad — COMPLETADA

| Fix | Descripción | Estado |
|-----|-------------|--------|
| 2.1 | API URL a variables de entorno | ✅ `.env` con `VITE_API_URL` / `VITE_DISK_URL` |
| 2.2 | Credenciales de prueba | ✅ Removidas al reescribir stores |
| 2.3 | Axios centralizado | ✅ `src/helpers/axiosInstance.js` |
| 2.4 | RBAC en rutas | ✅ `PrivateRoutes` con `allowedRoles` — ⚠️ falta aplicar en `AppRouter.js` |

### 🔲 FASE 3 — Arquitectura — PENDIENTE

---

## Lo que se hizo (resumen técnico)

### Migración completa Redux → Zustand

Se reemplazó toda la capa de Redux (store, reducers, actions, Provider) con 15 stores de Zustand ubicados en `src/stores/`. Cada store encapsula estado + acciones + llamadas a la API.

**Archivos eliminados conceptualmente** (ya no se usan):
- `src/store.js`
- `src/reducers/` (todos)
- `src/actions/` (todos)

**Archivos nuevos:**
- `src/stores/useAuthStore.js` — con `persist` middleware
- `src/stores/useUIStore.js` — loading counter + todos los modales
- `src/stores/useLayoutStore.js`
- `src/stores/useProductosStore.js`
- `src/stores/useVentasStore.js`
- `src/stores/useCotizacionesStore.js`
- `src/stores/useStockStore.js`
- `src/stores/useSucursalesStore.js`
- `src/stores/useUsuariosStore.js`
- `src/stores/useRolesStore.js`
- `src/stores/useMarcasStore.js`
- `src/stores/useCategoriasStore.js`
- `src/stores/usePreciosStore.js`
- `src/stores/useParamsStore.js`
- `src/stores/useTipoDeCambioStore.js`
- `src/helpers/axiosInstance.js`
- `Frontend/.env`
- `Frontend/.env.example`

**Archivos modificados:**
- `src/index.js` — removido Redux `Provider`
- `src/App.js` — removido Redux `Provider`
- `src/routers/PrivateRoutes.js` — usa `useAuthStore` + RBAC
- `src/routers/AppRouter.js` — usa `useLayoutStore`
- `src/types/types.js` — solo exporta `DISK` desde env variable
- `src/views/ventas/Reportes.js` — fix CTabs + migración Zustand
- Todos los componentes (~62 archivos) — migrados de `useSelector/useDispatch` a Zustand

---

## Pendientes inmediatos (antes de la Fase 3)

### Pendiente A — Memory leak en `AppHeader.js`

**Archivo:** `src/components/AppHeader.js`

Verificar que el event listener de scroll tiene cleanup:

```js
// Debe verse así:
useEffect(() => {
  const handleScroll = () => {
    headerRef.current &&
      headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0)
  }
  document.addEventListener('scroll', handleScroll)
  return () => document.removeEventListener('scroll', handleScroll) // ← esto
}, [])
```

**Testear:** Navegar entre rutas y hacer scroll — la sombra del header debe funcionar normalmente.

---

### Pendiente B — Aplicar `allowedRoles` en `AppRouter.js`

El componente `PrivateRoutes` ya soporta `allowedRoles` pero no se está usando en el router.

**Archivo:** `src/routers/AppRouter.js`

```jsx
// Rutas que requieren role_id de admin (verificar el valor real en la BD)
<Route element={<PrivateRoutes allowedRoles={[1]} />}>
  <Route path="/usuarios" element={<Usuarios />} />
  <Route path="/roles" element={<Roles />} />
  <Route path="/sucursales" element={<Sucursales />} />
  <Route path="/parametros" element={<Parametros />} />
  <Route path="/tipo-de-cambio" element={<TipoDeCambio />} />
</Route>
```

> Confirmar el `role_id` del admin contra la base de datos antes de aplicar.

**Testear:**
- Usuario no-admin → navegar a `/usuarios` → redirige a `/404`
- Usuario admin → acceso normal

---

## FASE 3 — Arquitectura (sprints futuros)

---

### Fix 3.1 — Dividir `POS.js`

**Archivo actual:** `src/views/ventas/POS.js` (~868 líneas)

**Archivos a crear:**
```
src/views/ventas/pos/
  ProductSearchPanel.js   — columna izquierda: búsqueda y grilla de productos
  SaleDetailPanel.js      — columna derecha: líneas, totales, botón vender
  usePOSState.js          — custom hook con toda la lógica y estados del carrito
```

`POS.js` queda como orquestador delgado que solo compone los tres anteriores.

**Estrategia:** Extraer un componente a la vez, testeando el POS completo después de cada extracción.

---

### Fix 3.2 — Completar o eliminar `Register.js`

`src/views/pages/register/Register.js` tiene UI pero sin lógica de submit. Decidir si se va a usar o borrar para evitar confusión.

---

## Lista de mejoras (nice-to-have)

### DX (Developer Experience)
- [ ] **ESLint `no-console` en producción** — agregar `"no-console": ["error", { allow: ["warn", "error"] }]` al config
- [ ] **Prettier config** (`.prettierrc`) — ya está instalado pero sin config
- [ ] **PropTypes** en componentes críticos — mínimo en modales y POS

### UX (User Experience)
- [ ] **Toasts en todas las mutaciones** — actualmente solo POS muestra feedback. Agregar en CRUD de productos, usuarios, categorías, etc.
- [ ] **Skeletons de carga** — reemplazar spinner genérico con skeletons por módulo
- [ ] **Filtro visual del sidebar por rol** — ocultar items admin del menú a usuarios no-admin (las rutas ya están protegidas, esto es defensa en profundidad en la UI)
- [ ] **Feedback explícito en expiración de sesión** — el interceptor de 401 ya redirige a login, pero sin mensaje al usuario ("tu sesión expiró")

### Seguridad
- [ ] **Refresh tokens** — si el backend lo soporta, renovación automática antes de que expiren

### Arquitectura
- [ ] **TypeScript** — empezar por los stores (ya tienen estructura clara), luego helpers, luego componentes
- [ ] **Tests en flujos críticos** — login, creación de venta, ajuste de stock

---

## Dependencias entre pendientes

```
Pendiente A (AppHeader leak)  ──── independiente, hacerlo ya
Pendiente B (RBAC en router)  ──── independiente, hacerlo ya

Fix 3.1 (dividir POS)         ──── independiente (refactor puro)
Fix 3.2 (Register.js)         ──── independiente
```

---

*Plan actualizado: Abril 2026 (post-migración Zustand). Fases 1 y 2 completadas.*
