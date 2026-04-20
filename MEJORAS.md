# InVenta2 — Análisis de Mejoras, Nuevos Módulos y Buenas Prácticas

> Generado: Abril 2026 | Stack: React 18 + Zustand + CoreUI + Laravel 8

---

## Índice

1. [Buenas Prácticas Pendientes](#1-buenas-prácticas-pendientes)
2. [Mejoras Técnicas](#2-mejoras-técnicas)
3. [Seguridad](#3-seguridad)
4. [Rendimiento y UX](#4-rendimiento-y-ux)
5. [Nuevos Módulos Sugeridos](#5-nuevos-módulos-sugeridos)
6. [Nuevos Parámetros del Sistema](#6-nuevos-parámetros-del-sistema)
7. [Backend / API](#7-backend--api)
8. [Deuda Técnica Priorizada](#8-deuda-técnica-priorizada)

---

## 1. Buenas Prácticas Pendientes

### 1.1 PropTypes en componentes críticos

Los componentes `ProductSearchPanel`, `SaleDetailPanel`, y todos los modales reciben props sin validación de tipos. Si no se migra a TypeScript, al menos agregar PropTypes evita bugs silenciosos.

```js
// SaleDetailPanel.js
SaleDetailPanel.propTypes = {
  lineas: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    descripcion: PropTypes.string.isRequired,
    cantidad: PropTypes.number.isRequired,
    precio: PropTypes.number.isRequired,
  })),
  onChangeCantidad: PropTypes.func.isRequired,
}
```

**Archivos a revisar:** todos los componentes en `src/views/ventas/pos/`, `src/components/shared/`

---

### 1.2 Eliminar console.log en producción

Algunos stores y handlers tienen `console.log` de depuración. En producción exponen estado interno.

**Solución rápida** en `vite.config.mjs`:
```js
build: {
  minify: 'terser',
  terserOptions: {
    compress: {
      drop_console: true,  // Elimina console.log en build
      drop_debugger: true,
    },
  },
}
```

**Solución robusta:** agregar la regla en `.eslintrc`:
```json
"rules": {
  "no-console": ["warn", { "allow": ["warn", "error"] }]
}
```

---

### 1.3 Prettier y ESLint integrados en git hooks

Hoy se pueden commitear archivos sin formatear. Agregar `lint-staged` + `husky` para forzar formato antes de cada commit.

```bash
npm install --save-dev husky lint-staged
```

```json
// package.json
"lint-staged": {
  "src/**/*.{js,jsx}": ["eslint --fix", "prettier --write"]
}
```

---

### 1.4 Variables de entorno documentadas

Crear `Frontend/.env.example` con todas las variables necesarias (sin valores reales) para que otros devs puedan levantar el proyecto sin adivinar:

```env
VITE_API_URL=http://localhost:8000
VITE_DISK_URL=http://localhost:8000/storage/images
# Agregar aquí cualquier nueva variable
```

---

### 1.5 Filtro del menú sidebar por rol

Las rutas admin están protegidas en `PrivateRoutes.js`, pero los items del menú (`_nav.js`) siguen apareciendo para todos los roles. Un usuario no-admin ve "Usuarios", "Roles", etc. en el sidebar y recibe un 404 al hacer click.

**Solución en `AppSidebar.js`:**
```js
const { usuario } = useAuthStore()

const navFiltered = navItems.filter(item =>
  !item.adminOnly || usuario?.role_id === 1
)
```

Y en `_nav.js` agregar la propiedad `adminOnly: true` a los items protegidos.

---

### 1.6 Toasts de confirmación en todas las mutaciones

Algunas operaciones (crear, editar, eliminar) no muestran feedback visual al usuario. Estandarizar el patrón de toast en todos los stores para que siempre haya una confirmación.

```js
// Patrón a seguir
createItem: async (item) => {
  try {
    await api.post('/items', item)
    addToast(successToast('Item creado correctamente')) // ← siempre
    closeModal()
    getItems()
  } catch (error) {
    set({ error: errorResponse(error) })
  }
}
```

---

## 2. Mejoras Técnicas

### 2.1 Migración a TypeScript (Alta prioridad)

El mayor riesgo de regresión hoy es la ausencia de tipos. Con 15 stores, 55+ vistas y props sin documentar, cualquier refactor puede romper silenciosamente.

**Estrategia incremental (no big-bang):**

| Fase | Qué migrar | Impacto |
|------|-----------|---------|
| 1 | `src/helpers/` + `src/types/` | Bajo riesgo, alto valor |
| 2 | `src/stores/` (15 stores) | Captura la mayoría de bugs de contrato |
| 3 | `src/views/ventas/pos/` | Módulo más crítico del negocio |
| 4 | El resto incremental | Un archivo a la vez |

Cambiar la extensión a `.ts`/`.tsx` y agregar tipos básicos basta para empezar. Vite soporta TypeScript sin configuración adicional.

---

### 2.2 Tests unitarios y de integración

Hoy no hay ningún test. Las regresiones se detectan en producción.

**Stack recomendado:**
- **Vitest** — compatible con Vite, sintaxis Jest
- **React Testing Library** — tests orientados a comportamiento del usuario
- **MSW (Mock Service Worker)** — intercepta llamadas API en tests

**Qué testear primero (mayor ROI):**

```
src/helpers/global.js          → errorResponse(), formatPrice(), etc.
src/stores/useAuthStore.js     → login, logout, persistencia
src/views/ventas/pos/usePOSState.js  → lógica crítica del POS
```

**Ejemplo de test de POS:**
```js
it('no permite agregar producto sin stock si params[2] = "1"', () => {
  // Simular params con control de stock activo
  // Intentar agregar producto con existencias = 0
  // Esperar toast de error
})
```

---

### 2.3 React Query o SWR para cache de datos

Los stores de Zustand hacen fetch en cada montaje de componente. Si el usuario navega entre vistas, los datos se refrescan innecesariamente (categorías, marcas, sucursales cambian poco).

**React Query** reemplaza el patrón `getXXX` en stores con cache inteligente, revalidación en background y deduplicación de requests.

```js
// Antes (Zustand)
useEffect(() => { getCategorias('lista') }, [])

// Después (React Query)
const { data: categorias, isLoading } = useQuery({
  queryKey: ['categorias'],
  queryFn: () => api.get('/categories/lista').then(r => r.data.data),
  staleTime: 5 * 60 * 1000, // 5 min de cache
})
```

Los stores de Zustand se mantendrían solo para estado de UI (modales, loading global, usuario autenticado).

---

### 2.4 Lazy loading de imágenes de productos

Las tablas de productos cargan todas las imágenes al render. Con catálogos grandes esto es costoso.

```js
// En TablaProductos.js
<img
  src={producto.imagen_url}
  loading="lazy"          // ← nativo del browser
  decoding="async"
  alt={producto.nombre}
/>
```

---

### 2.5 Paginación en el POS

El panel de búsqueda del POS carga N productos. Si el catálogo crece, esto se vuelve lento. Implementar scroll infinito o paginación en `ProductSearchPanel`.

---

### 2.6 Refresh token

El token JWT actual no tiene mecanismo de renovación. Si expira mientras el usuario trabaja, recibe un 401 y es redirigido a login abruptamente, perdiendo el estado del POS.

**Solución en `axiosInstance.js`:**
```js
// Interceptor de respuesta
api.interceptors.response.use(null, async (error) => {
  if (error.response?.status === 401 && !error.config._retry) {
    error.config._retry = true
    const newToken = await refreshToken() // POST /auth/refresh
    localStorage.setItem('token', newToken)
    error.config.headers.Authorization = `Bearer ${newToken}`
    return api(error.config)
  }
  return Promise.reject(error)
})
```

Requiere que el backend implemente `POST /auth/refresh`.

---

## 3. Seguridad

### 3.1 Rutas API sin middleware global de autenticación

En `Backend/routes/api.php` las rutas no están bajo un middleware `auth:api` global. Cada controlador verifica auth de forma individual, lo que significa que un nuevo endpoint olvidado queda público.

**Solución recomendada en `api.php`:**
```php
// Agrupar TODAS las rutas protegidas bajo middleware
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('products', ProductController::class);
    Route::apiResource('sales', SaleController::class);
    // ... todas las rutas
});

// Solo login queda fuera
Route::post('/login', [UserController::class, 'login']);
```

---

### 3.2 Token en localStorage (XSS risk)

JWT en `localStorage` es vulnerable a XSS. Si alguna dependencia inyecta código malicioso, el token puede ser robado.

**Alternativa más segura:** httpOnly cookies (el servidor setea la cookie, JS no puede leerla).

**Implicaciones:**
- Requiere cambios en el backend (Laravel)
- El interceptor de Axios ya no necesita agregar el header manualmente
- CSRF token necesario para POST/PUT/DELETE

Esta es una mejora de seguridad avanzada; evaluar según el nivel de riesgo del cliente.

---

### 3.3 Rate limiting en el backend

El endpoint de login no tiene protección contra fuerza bruta.

**En Laravel:**
```php
// routes/api.php
Route::middleware(['throttle:5,1'])->group(function () {
    Route::post('/login', [UserController::class, 'login']);
});
// Limita a 5 intentos por minuto
```

---

### 3.4 Validación de imágenes en el backend

El endpoint de upload de imágenes debe validar tipo MIME real (no solo extensión) y tamaño máximo en el backend, no solo en el cliente.

```php
// ImageController.php
$request->validate([
    'image' => 'required|image|mimes:jpeg,png,webp|max:2048', // 2MB
]);
```

---

### 3.5 CORS restrictivo en producción

En producción, `CORS_ALLOWED_ORIGINS` debería apuntar solo al dominio del frontend, no a `*`.

```env
# .env producción
CORS_ALLOWED_ORIGINS=https://app.midominio.com
```

---

## 4. Rendimiento y UX

### 4.1 Skeleton loaders en lugar de spinner global

Actualmente un spinner global bloquea toda la UI durante cualquier fetch. Una mejor UX muestra skeletons en cada sección mientras carga.

```js
// En lugar de bloquear todo con loading global
{loading ? <SkeletonTabla rows={10} cols={5} /> : <TablaProductos ... />}
```

Esto permite que el usuario vea la estructura de la página mientras espera datos.

---

### 4.2 Virtualización de tablas largas

Con `@tanstack/react-table` ya instalado, agregar `@tanstack/react-virtual` para renderizar solo las filas visibles en tablas con 500+ items.

```js
import { useVirtualizer } from '@tanstack/react-virtual'
```

---

### 4.3 Debounce en todos los buscadores

El POS ya tiene debounce de 500ms en la búsqueda. Verificar que todos los otros buscadores (productos, ventas, usuarios) también tengan debounce para evitar requests en cada tecla.

---

### 4.4 Memoización en componentes costosos

Las tablas con muchas columnas y las listas del POS se re-renderizan ante cualquier cambio de estado. Usar `React.memo` y `useCallback` en handlers pasados como props.

```js
// usePOSState.js
const handleClickAdd = useCallback((producto) => {
  // ...
}, [lineas, params]) // Solo re-crea si cambian lineas o params
```

---

### 4.5 PWA (Progressive Web App)

El POS se usa en contextos de venta donde la conexión puede ser inestable. Convertir el frontend en una PWA con `vite-plugin-pwa` permitiría:

- Funcionar offline con datos cacheados
- Instalar como app en tablets/celulares
- Push notifications para alertas de stock bajo

```bash
npm install vite-plugin-pwa
```

---

### 4.6 Modo oscuro completo

CoreUI soporta modo oscuro. `useLayoutStore` ya tiene el campo `darkMode`. Verificar que todos los componentes custom (tablas, modales de POS) respeten el tema.

---

## 5. Nuevos Módulos Sugeridos

### 5.1 Módulo de Compras / Órdenes de Compra

**Qué hace:** Permite registrar compras a proveedores, relacionarlas con entradas de stock, y tener trazabilidad de costos.

**Tablas nuevas:** `suppliers`, `purchase_orders`, `purchase_order_details`

**Impacto:** Complementa el módulo de Stock existente. Las entradas de stock podrían generarse automáticamente desde una orden de compra aprobada.

**Vistas:**
- `Proveedores` — CRUD proveedores
- `OrdenesDeCompra` — CRUD con estados (borrador → aprobada → recibida)
- `RecepcionMercaderia` — confirma recepción parcial o total

---

### 5.2 Módulo de Clientes y CRM básico

**Qué hace:** Registrar clientes con historial de compras, saldo a favor, y notas.

**Tablas nuevas:** `customers`, `customer_notes`

**Integración con POS:** Al registrar una venta, asociarla a un cliente. Permite:
- Historial de compras por cliente
- Estadísticas de cliente frecuente
- Descuentos por cliente VIP

**Vistas:**
- `AdministrarClientes` — CRUD
- `HistorialCliente` — timeline de ventas
- Selector de cliente en el POS (campo opcional)

---

### 5.3 Módulo de Cuentas por Cobrar (Ventas a crédito)

**Qué hace:** Registrar ventas a crédito y gestionar pagos parciales.

**Tablas nuevas:** `account_receivables`, `payments`

**Flujo:**
1. En el POS, marcar venta como "a crédito"
2. Se crea un registro en `account_receivables`
3. El módulo muestra saldo pendiente por cliente
4. Se registran pagos parciales hasta saldar

**Vistas:**
- `CuentasPorCobrar` — lista de deudas pendientes
- `RegistrarPago` — modal para registrar abonos
- Alerta en dashboard si hay cuentas vencidas

---

### 5.4 Módulo de Auditoría / Log de Actividad

**Qué hace:** Registrar quién hizo qué y cuándo (ventas anuladas, productos editados, precios cambiados).

**Implementación Backend:**
```php
// Laravel Observer
class ProductObserver {
    public function updated(Product $product) {
        AuditLog::create([
            'user_id' => auth()->id(),
            'action' => 'update',
            'model' => 'Product',
            'model_id' => $product->id,
            'changes' => json_encode($product->getDirty()),
        ]);
    }
}
```

**Vista:**
- `LogDeActividad` — tabla filtrable por usuario, fecha, tipo de acción
- Solo accesible por admin

---

### 5.5 Módulo de Descuentos y Promociones

**Qué hace:** Configurar reglas de descuento automático (por monto, por cantidad, por fecha).

**Tablas nuevas:** `discounts` con campos: `type` (porcentaje/monto), `min_amount`, `valid_from`, `valid_to`, `applies_to` (todos/categoría/producto)

**Integración con POS:** Al agregar productos al carrito, el POS aplica automáticamente los descuentos vigentes.

**Vistas:**
- `AdministrarDescuentos` — CRUD de reglas (admin)
- Badge visual en el POS cuando se aplica un descuento

---

### 5.6 Módulo de Alertas de Stock Mínimo

**Qué hace:** Notificar cuando el stock de un producto baja del mínimo configurado.

**Cambios Backend:**
- Agregar campo `stock_minimo` a la tabla `products`
- Job programado (Laravel Scheduler) que detecta stock bajo y crea alertas

**Vista:**
- Widget en Dashboard: "X productos con stock bajo"
- Página de detalle con listado y acceso rápido a crear entrada de stock

---

### 5.7 Dashboard Mejorado con KPIs

**KPIs a agregar:**

| Métrica | Descripción |
|---------|-------------|
| Ventas del día vs. ayer | Comparación porcentual |
| Ticket promedio | Total ventas / cantidad |
| Producto más vendido (mes) | Top 5 con gráfico |
| Crecimiento mensual | Gráfico de línea 12 meses |
| Stock crítico | Productos bajo mínimo |
| Margen bruto | (Precio - Costo) / Precio |
| Top vendedores | Si hay múltiples usuarios |

---

### 5.8 Módulo de Exportación de Reportes

**Qué hace:** Exportar tablas y reportes a Excel/PDF directamente desde el sistema.

**Librerías:**
- `xlsx` o `exceljs` — para Excel en el frontend
- `jsPDF` + `jspdf-autotable` — para PDF con tablas

**Dónde agregar:**
- Botón "Exportar" en: Ventas, Stock, Productos, Reportes diarios
- Columnas exportadas configurables

---

### 5.9 Módulo de Configuración de Impresión de Tickets

**Qué hace:** Personalizar el ticket de venta (logo, pie de página, términos, etc.) desde la UI sin tocar código.

**Parámetros a agregar en `ParametrosGenerales`:**
- Logo del negocio
- Dirección / teléfono
- Texto de pie de ticket ("Gracias por su compra")
- Número de copias a imprimir
- Formato: ticket 80mm / A4

---

## 6. Nuevos Parámetros del Sistema

Actualmente `Param` tiene pocos registros. Expandir con los siguientes parámetros configurables desde `ParametrosGenerales`:

| ID | Clave | Descripción | Valor por defecto |
|----|-------|-------------|-------------------|
| 3 | `MONEDA_SIMBOLO` | Símbolo de moneda local | `Bs.` |
| 4 | `MONEDA_NOMBRE` | Nombre de la moneda | `Bolivianos` |
| 5 | `DECIMALES_PRECIO` | Decimales en precios | `2` |
| 6 | `TICKET_FOOTER` | Texto pie de ticket | `Gracias por su compra` |
| 7 | `STOCK_MINIMO_ALERTA` | Activar alertas de stock | `1` |
| 8 | `VENTA_CREDITO` | Permitir ventas a crédito | `0` |
| 9 | `DESCUENTO_MAXIMO` | % descuento máximo en POS | `100` |
| 10 | `IMPUESTO_PORCENTAJE` | % impuesto aplicado | `0` |
| 11 | `BACKUP_AUTOMATICO` | Frecuencia backup BD | `diario` |
| 12 | `SESION_TIMEOUT` | Minutos inactividad antes de logout | `60` |
| 13 | `PERMITIR_PRECIO_MANUAL` | POS puede cambiar precio | `1` |
| 14 | `COTIZACION_DIAS_VALIDEZ` | Días de validez de cotización | `7` |
| 15 | `MODO_MULTISUCURSAL` | Habilitar gestión multi-sucursal | `1` |

---

## 7. Backend / API

### 7.1 Actualizar Laravel 8 → Laravel 11

Laravel 8 (2020) entra en fin de soporte de seguridad. Laravel 11 (2024) incluye:
- PHP 8.2+ requerido
- Mejor rendimiento
- Nuevas funciones de Eloquent
- Soporte de seguridad hasta 2026+

**Estrategia:** Migrar en entorno de staging, actualizar `composer.json`, resolver breaking changes.

---

### 7.2 API Resources para responses consistentes

Los controllers retornan arrays directos. Usar `Laravel API Resources` para garantizar una estructura consistente y ocultar campos sensibles.

```php
// ProductResource.php
class ProductResource extends JsonResource {
    public function toArray($request) {
        return [
            'id' => $this->id,
            'nombre' => $this->name,
            'precio' => $this->price,
            'stock' => $this->stock,
            // Sin: created_at, updated_at, deleted_at en listados
        ];
    }
}
```

---

### 7.3 Paginación consistente en todos los endpoints

Algunos endpoints retornan todos los registros sin paginar. Estandarizar con paginación server-side y parámetros `?page=1&per_page=15&search=xxx`.

---

### 7.4 Soft deletes en todos los modelos

Verificar que todos los modelos que deberían tener historial usen `SoftDeletes`. Especialmente `SaleDetail`, `EntryDetail` y `QuotationDetail`.

---

### 7.5 Caché de consultas frecuentes

Categorías, marcas y sucursales se consultan en cada carga. Usar Laravel Cache para evitar queries repetidas:

```php
// CategoryController.php
$categories = Cache::remember('categories_lista', 3600, function () {
    return Category::where('estado', 1)->get();
});
// Invalidar cache en create/update/delete
Cache::forget('categories_lista');
```

---

### 7.6 Jobs en queue para operaciones pesadas

Operaciones como exportación de reportes, generación de backups, o envío de notificaciones no deberían bloquear el request HTTP.

```php
// Despachar a la queue
GenerateReportJob::dispatch($filters)->onQueue('reports');
```

---

### 7.7 Documentación de API con Scribe o L5-Swagger

No hay documentación de la API. `Scribe` genera documentación automática desde los controllers y FormRequests:

```bash
composer require knuckleswtf/scribe
php artisan scribe:generate
```

Genera un sitio estático en `/docs` con todos los endpoints, parámetros y ejemplos.

---

## 8. Deuda Técnica Priorizada

| Prioridad | Item | Esfuerzo | Impacto |
|-----------|------|----------|---------|
| 🔴 Alta | Agregar tests (Vitest + RTL) | Alto | Previene regresiones |
| 🔴 Alta | Middleware auth global en API routes | Bajo | Cierra superficie de ataque |
| 🔴 Alta | Rate limiting en endpoint de login | Bajo | Previene fuerza bruta |
| 🟡 Media | Migración incremental a TypeScript | Alto | Reduce bugs en refactors |
| 🟡 Media | Filtro del menú sidebar por rol | Bajo | UX + consistencia con RBAC |
| 🟡 Media | Refresh token | Medio | Evita logout abrupto |
| 🟡 Media | React Query para cache de datos | Medio | Reduce requests innecesarios |
| 🟡 Media | Skeleton loaders | Bajo | UX significativamente mejor |
| 🟢 Baja | Husky + lint-staged | Bajo | Calidad de código |
| 🟢 Baja | `.env.example` | Muy bajo | Onboarding de devs |
| 🟢 Baja | drop_console en build | Muy bajo | Seguridad en producción |
| 🟢 Baja | Actualizar Laravel 8 → 11 | Alto | Soporte de seguridad |
| 🟢 Baja | Documentación API (Scribe) | Bajo | Mantenibilidad |

---

## Resumen de Módulos Propuestos

```
Módulos Actuales:          Módulos Propuestos:
─────────────────          ──────────────────
✅ POS                     → + Selección de cliente en POS
✅ Ventas                  → + Ventas a crédito
✅ Cotizaciones            → + Validez configurable
✅ Productos               → + Stock mínimo + alertas
✅ Categorías / Marcas     → (estables)
✅ Stock (Entradas/Salidas)→ + Órdenes de compra
✅ Usuarios / Roles        → (estables)
✅ Sucursales              → (estables)
✅ Parámetros              → + 12 parámetros nuevos
✅ Tipos de Cambio         → (estable)
✅ Dashboard               → + KPIs avanzados
                           + Clientes / CRM básico
                           + Descuentos y Promociones
                           + Log de Auditoría
                           + Exportación Excel/PDF
                           + Config. de Tickets de impresión
                           + Cuentas por Cobrar
                           + Compras / Proveedores
```

---

*Documento generado con análisis estático del código fuente. Prioridades sugeridas según impacto técnico y de negocio.*
