# Plan de Correcciones — InVenta2 Frontend
> Ordenado por riesgo e impacto. Cada fix es atómico y testeable antes de seguir.
> **Actualizado:** post-Fase 3 (Abril 2026).

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
| 1.2 | Memory leak en `AppHeader.js` | ✅ Verificado — cleanup presente en línea 44 |
| 1.3 | Sesión persistente + JWT | ✅ `useAuthStore` + `axiosInstance.js` |
| 1.4 | `console.log` en producción | ✅ Stores no usan console.log de errores |
| 1.5 | Race condition en `loading` | ✅ `loadingCount` entero en `useUIStore` |

### ✅ FASE 2 — Seguridad — COMPLETADA

| Fix | Descripción | Estado |
|-----|-------------|--------|
| 2.1 | API URL a variables de entorno | ✅ `.env` con `VITE_API_URL` / `VITE_DISK_URL` |
| 2.2 | Credenciales de prueba | ✅ Removidas al reescribir stores |
| 2.3 | Axios centralizado | ✅ `src/helpers/axiosInstance.js` |
| 2.4 | RBAC en rutas | ✅ `allowedRoles` en `routes.js` + agrupación en `AppContent.js` |

### ✅ FASE 3 — Arquitectura — COMPLETADA

| Fix | Descripción | Estado |
|-----|-------------|--------|
| 3.1 | Dividir `POS.js` | ✅ `pos/usePOSState.js` + `pos/ProductSearchPanel.js` + `pos/SaleDetailPanel.js` |
| 3.2 | Completar o eliminar `Register.js` | ✅ Ruta eliminada de `AppRouter.js` (UI sin lógica, usuarios los crea el admin) |

---

## Lo que se hizo (resumen técnico)

### Migración completa Redux → Zustand

Se reemplazó toda la capa de Redux con 15 stores de Zustand en `src/stores/`.

### RBAC aplicado en rutas

`routes.js` tiene `allowedRoles: [1]` en: `/usuarios`, `/roles`, `/sucursales`, `/parametros`, `/tiposdecambio`.
`AppContent.js` agrupa esas rutas bajo `<Route element={<PrivateRoutes allowedRoles={[1]} />}>`.

### División de POS.js

| Archivo | Responsabilidad |
|---------|----------------|
| `src/views/ventas/pos/usePOSState.js` | Todo el estado, handlers y lógica del POS |
| `src/views/ventas/pos/ProductSearchPanel.js` | Columna izquierda: selector de sucursal, buscador, grilla de productos |
| `src/views/ventas/pos/SaleDetailPanel.js` | Columna derecha: líneas, totales, botón vender |
| `src/views/ventas/POS.js` | Orquestador delgado (~50 líneas) |

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
- [ ] **Historial de git** — si el repo alguna vez fue público, rotar credenciales que hayan estado en el historial

### Arquitectura
- [ ] **TypeScript** — empezar por los stores (ya tienen estructura clara), luego helpers, luego componentes
- [ ] **Tests en flujos críticos** — login, creación de venta, ajuste de stock

---

*Plan actualizado: Abril 2026 (Fases 1, 2 y 3 completadas).*
