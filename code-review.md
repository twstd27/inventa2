# Code Review — InVenta2 Frontend
> Análisis honesto desde perspectiva senior developer. Abril 2026.

---

## TL;DR

El proyecto tiene una base funcional decente: estructura organizada, Redux aplicado con cierta consistencia, CoreUI bien integrado. Sin embargo, hay problemas serios de seguridad, bugs reales en el estado global, y patrones que van a hacer difícil escalar o mantener esto. Nada que no se pueda corregir, pero hay que priorizarlo bien.

**Calificación general: 5.5 / 10**
> Funciona, pero no es producción-seguro ni fácil de mantener en equipo.

---

## 1. Seguridad — CRÍTICO

### 1.1 URL del API hardcodeada en el código fuente
**Archivo:** `src/types/types.js`

La URL de producción `https://api.sublimack.com` está directamente en el código. Cualquiera que acceda al bundle compilado (y es público) puede verla. Aunque no es catastrófico, es mala práctica y complica cambiar de entorno.

**Fix:** Usar variables de entorno de Vite.
```js
// .env.production
VITE_API_URL=https://api.sublimack.com

// types.js
const api = import.meta.env.VITE_API_URL
```

---

### 1.2 Credenciales de prueba en el repositorio
**Archivo:** `src/views/pages/login/Login.js` (líneas comentadas)

```js
// email: 'newlui2.0@gmail.com',
// password: '75821442',
```

Aunque estén comentadas, estas credenciales están en el historial de git. Si el repo es privado y las credenciales ya no sirven, es tolerable. Si no, hay que rotar esas credenciales y borrar el commit con `git rebase` o `git filter-branch`.

---

### 1.3 Sin manejo de tokens JWT
**Archivo:** `src/actions/authAction.js`

El login despacha el usuario al store pero **no almacena ningún token**. No hay `Authorization: Bearer ...` en las requests. El TODO en línea 5 lo reconoce:

```js
// TODO: hacer persistente el inicio de sesion
```

Esto significa que si el API usa JWT (como toda API moderna debería), las requests autenticadas están fallando silenciosamente o el backend tiene sesiones sin stateless, lo que es un problema de escalabilidad.

**Fix mínimo:**
```js
// Guardar token al hacer login
localStorage.setItem('token', response.data.data.token)

// Axios instance con interceptor
api.interceptors.request.use(config => {
  config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
  return config
})
```

---

### 1.4 Sin protección de rutas por rol (RBAC)
**Archivo:** `src/routers/PrivateRoutes.js`

Solo verifica si el usuario está logueado (`logged`), pero no verifica el `role_id`. Un vendedor puede acceder a rutas de administrador si sabe la URL. El campo `permissions` existe en el estado pero no se usa para nada.

---

### 1.5 Datos sensibles en consola
Múltiples archivos de actions hacen `console.log(error.response)` en catch blocks. En producción esto puede exponer estructura de la base de datos, mensajes de error del ORM, etc. Hay que eliminarlo todo antes de deploy.

---

## 2. Bugs reales

### 2.1 Caso duplicado en uiReducer — BUG CONFIRMADO
**Archivo:** `src/reducers/uiReducer.js`

`types.ui.openVentasDialog` aparece dos veces en el switch. JavaScript ejecuta el último que encuentra. El primero es código muerto e indica que hubo una refactorización incompleta. Puede estar causando comportamiento inconsistente en los modales de ventas.

---

### 2.2 Sesión no persiste al recargar
**Archivo:** `src/actions/authAction.js`

El estado de Redux se pierde al recargar la página. El usuario tiene que loguearse cada vez. Esto está a medias: hay comentarios que lo reconocen pero no está implementado. Es un bug UX severo.

**Fix básico:** Al inicializar el store, leer de `localStorage` el estado de auth.

---

### 2.3 Race condition en loading global
**Archivo:** `src/reducers/uiReducer.js`

Hay un solo flag `loading` para todas las requests. Si dos requests están en vuelo simultáneo y la primera termina, `loading` se pone en `false` aunque la segunda siga activa. Esto hace que el spinner desaparezca antes de tiempo.

---

### 2.4 Memory leak en AppHeader
**Archivo:** `src/components/AppHeader.js`

```js
useEffect(() => {
  document.addEventListener('scroll', handler)
  // ❌ Nunca se remueve el listener
}, [])
```

Cada vez que el componente se monta agrega un event listener sin limpiarlo. En apps con routing esto se acumula.

```js
useEffect(() => {
  document.addEventListener('scroll', handler)
  return () => document.removeEventListener('scroll', handler) // ✅
}, [])
```

---

### 2.5 Tab controlado sin handler — el bug que ya corregimos
**Archivo:** `src/views/ventas/Reportes.js`

`CTabs` con `activeItemKey` fijo sin `onActiveItemChange`. Las pestañas nunca cambiaban. Ya corregido.

---

## 3. Arquitectura y diseño

### 3.1 No hay una instancia centralizada de Axios
Cada action file hace `axios.get(...)` o `axios.post(...)` directamente con la URL completa. Esto significa que si necesitas agregar headers de autenticación, logging, retry logic, o cambiar la base URL, hay que tocar ~15 archivos.

**Lo correcto:**
```js
// src/api/client.js
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
})

api.interceptors.request.use(/* auth headers */)
api.interceptors.response.use(/* error handling global */)

export default api
```

Esto es posiblemente el cambio de mayor impacto positivo que se puede hacer.

---

### 3.2 Redux legacy — no es urgente pero sí deuda técnica
**Archivo:** `src/store.js`

Usa `legacy_createStore` que está deprecado. El ecosistema Redux recomienda Redux Toolkit (`@reduxjs/toolkit`) que reduce el boilerplate a la mitad, incluye Immer para mutaciones inmutables, y tiene `createAsyncThunk` para el manejo de loading/error por request.

No es un bug, pero si en algún momento hay que onboardear a alguien nuevo, va a ser más trabajo.

---

### 3.3 Componente POS.js de 868 líneas
**Archivo:** `src/views/ventas/POS.js`

Es el componente más complejo del proyecto y maneja demasiadas cosas: búsqueda de productos, carrito, facturación, tipo de cambio, diálogos, toasts. Es muy difícil de debuggear y de modificar sin romper algo.

Debería dividirse al menos en:
- `<ProductSearch />`
- `<POSCart />`
- `<POSSummary />`
- `useCart()` custom hook para la lógica del carrito

---

### 3.4 Estado mixto Redux + useState en formularios
Varios modales tienen Redux state Y useState local para el mismo formulario. Esto crea dos fuentes de verdad y puede causar que los datos del modal se desincronicen. Hay que elegir uno: o todo en Redux (para formularios complejos con validación compartida) o todo local con `useState`/`useReducer`.

---

## 4. Mantenibilidad

### ¿Qué tan fácil es mantener esto?

**Corto plazo (1-3 meses):** Manejable si el mismo dev lo toca. La estructura es predecible una vez que la conocés.

**Mediano plazo (3-12 meses, equipo de 2-3 devs):** Empieza a ser problemático. Sin TypeScript, sin tests, con el reducer duplicado y el estado mixto, las regresiones van a ser frecuentes.

**Largo plazo o nuevo dev en el equipo:** Difícil. No hay documentación, no hay tests, los patterns son inconsistentes entre archivos (algunos actions tienen loading, otros no; algunos errores se loguean, otros se dispatchen). Un dev nuevo va a tardar semanas en entender qué está pasando.

---

### Factores negativos de mantenibilidad:
- Sin TypeScript: refactors son riesgosos
- Sin tests: no hay red de seguridad
- Manejo de errores inconsistente entre action files
- Dead code (Register.js incompleto, código comentado en reducers)
- TODOs sin ticket/issue asociado
- Nombres de componentes inconsistentes (`AdministrarMarcas` en un archivo de ventas)

### Factores positivos:
- Estructura de carpetas clara
- Redux bien separado por dominio
- Uso consistente de CoreUI
- React.lazy en las rutas (buen punto)

---

## 5. Prioridades recomendadas

### Ahora (antes de cualquier feature nueva)
1. **Mover API URL a variable de entorno** — 30 min de trabajo, gran impacto
2. **Corregir el case duplicado en uiReducer** — revisar cuál es el correcto y eliminar el otro
3. **Eliminar todos los `console.log` de producción** — búsqueda global y reemplazo

### Próximo sprint
4. **Crear instancia de Axios centralizada** — el cambio más impactante
5. **Implementar persistencia de sesión** — `localStorage` + hidratación del store
6. **Agregar RBAC básico en rutas** — proteger rutas admin con `role_id`
7. **Cleanup de memory leaks** — event listeners en AppHeader y similares

### Deuda técnica a planificar
8. Migrar a Redux Toolkit
9. Dividir POS.js en componentes
10. Agregar TypeScript (o al menos PropTypes en componentes críticos)
11. Agregar tests en flujos críticos: login, creación de venta, stock

---

## 6. Consejo final

El proyecto no está mal para lo que es — una app de gestión desarrollada probablemente por una o dos personas. La funcionalidad existe y la estructura tiene lógica. El problema es que hay decisiones de "lo dejo para después" que se acumularon (el TODO de la sesión, el Register incompleto, el reducer duplicado) y eso es lo que más duele en mantenibilidad.

Antes de agregar features nuevas, dedica un sprint a limpiar. Específicamente el eje autenticación→API→estado es donde más riesgo hay. Si la app tiene usuarios reales manejando ventas, el bug de sesión sin persistencia y la falta de tokens en requests debería ser prioridad inmediata.

---

*Generado con análisis estático del código fuente. Última revisión: Abril 2026.*
