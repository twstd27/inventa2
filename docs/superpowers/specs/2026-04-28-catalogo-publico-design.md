# Catálogo Público — Diseño

**Fecha:** 2026-04-28  
**Estado:** Aprobado

## Resumen

Exponer un catálogo público de productos por categoría, accesible sin autenticación mediante URL compartible. Orientado a potenciales clientes. No muestra stock. Incluye botón de WhatsApp para consultas.

**Rutas públicas:**
- `/#/catalogo` — landing con todas las categorías
- `/#/catalogo/:slug` — productos de una categoría (ej: `/#/catalogo/ropa-deportiva`)

---

## Arquitectura — Opción A

Componentes y controlador completamente nuevos. Cero cambios a código existente del POS o módulos autenticados.

---

## Backend

### Nuevas rutas públicas (`api.php`)

```php
Route::prefix('catalogo')->middleware(['throttle:60,1'])->group(function () {
    Route::get('categories', [CatalogoController::class, 'categories']);
    Route::get('params',     [CatalogoController::class, 'params']);
    Route::get('{slug}/products', [CatalogoController::class, 'products']);
});
```

Sin middleware `auth:api` ni `token.expiry`.

### Nuevo `CatalogoController`

**`categories()`**
- Retorna todas las categorías no eliminadas (sin soft-deleted)
- Agrega campo `slug` calculado: `Str::slug($category->name)`
- Solo campos: `id`, `name`, `slug`

**`products($slug)`**
- Busca la categoría cuyo `Str::slug(name)` coincida con `$slug`
- Si no existe → 404
- Retorna productos paginados (24/página) de esa categoría con: `code`, `name`, `marca`, `price`, `images`, `categories`
- Precios calculados igual que `ProductController::index()` (precio dinámico)
- Soporta parámetro `?page=N` para infinite scroll

**`params()`**
- Whitelist estricta — expone **solo** estos dos parámetros:
  - `RedondeoPrecios`
  - `NumeroWhatsAppCatalogo`
- Nunca expone la lista completa de params

### Slug

Generado en runtime con `Str::slug($category->name)`. No requiere migración. Las tildes y caracteres especiales se normalizan automáticamente (ej: "Electrónica" → `electronica`).

---

## Frontend

### Nuevas rutas en `AppRouter.js`

```jsx
const CatalogoHome      = React.lazy(() => import('../views/catalogo/CatalogoHome'))
const CatalogoCategoria = React.lazy(() => import('../views/catalogo/CatalogoCategoria'))

// Dentro de <Routes>, fuera de <PrivateRoutes>:
<Route exact path="/catalogo"      element={<CatalogoHome />} />
<Route exact path="/catalogo/:slug" element={<CatalogoCategoria />} />
```

### Nuevos archivos

#### `src/stores/useCatalogoStore.js`
- Zustand store independiente
- Usa axios sin interceptores de auth (instancia separada apuntando a la misma base URL)
- Estado: `{ categories, products, params, loading, page, hasMore }`
- Métodos: `getCategories()`, `getProducts(slug, page)`, `getParams()`, `resetProducts()`
- `getProducts` acumula páginas en `products` para infinite scroll (igual que `useProductosStore`)
- `resetProducts()` limpia `products`, `page` y `hasMore` — se llama al montar `CatalogoCategoria` para evitar mostrar datos de una categoría anterior

#### `src/views/catalogo/CatalogoHome.js`
- Llama `getCategories()` y `getParams()` al montar
- Grid responsive: `xs=6 sm=4 md=3 lg=2` (CoreUI `CRow`/`CCol`)
- Cada categoría: tarjeta con ícono Package (Lucide) + nombre en `#212529`
- Click en categoría → navega a `/catalogo/:slug`

#### `src/views/catalogo/CatalogoCategoria.js`
- Lee `:slug` del URL con `useParams()`
- Llama `getProducts(slug, 1)` al montar; infinite scroll carga páginas siguientes
- Barra superior: botón "← Catálogo" (ChevronLeft) + nombre de categoría
- Grid responsive igual que POS (`xs=6 lg=4 xl=3`)
- Renderiza `<CardCatalogo>` por cada producto
- Click en card → abre `<ModalCatalogo>`

#### `src/views/catalogo/CardCatalogo.js`
- Basado en `CardProducto` pero sin:
  - Indicador de stock (Warehouse)
  - Botón de IA (Sparkles / ChatGPT)
  - Botón de agregar al carrito
- Agrega: botón WhatsApp (MessageCircle, verde `#25D366`)
- Colores de texto: código `#0d6efd` bold, nombre `#212529`, marca `#495057`
- Click en imagen/nombre → callback `onVerDetalle(product)`
- Aplica `roundPrice` con `redondeo` prop

#### `src/views/catalogo/ModalCatalogo.js`
- Modal CoreUI, tamaño `lg`
- Layout dos columnas: imagen (carrusel si hay varias) | info
- Info muestra: categorías (badges), código (Hash icon), nombre, marca (Tag icon)
- **Solo precio normal** (`price`), con `roundPrice`
- Botón "Consultar por WhatsApp" (ancho completo, verde)
- Botón "Cerrar"
- Sin botón de etiqueta, sin precio descuento, sin precio mayorista

#### `src/views/administrar/ParametrosGenerales.js`
- Agregar campo de texto para `NumeroWhatsAppCatalogo` en la sección de parámetros existente
- Placeholder: `591XXXXXXXXX` (formato internacional sin +)
- Input tipo `text`

### WhatsApp URL

```
https://wa.me/{NumeroWhatsAppCatalogo}?text=Hola%2C+quisiera+consultar+sobre+la+disponibilidad+del+producto%3A+{code}+{name}+{marca}
```

Texto pre-rellenado: `Hola, quisiera consultar sobre la disponibilidad del producto: {code} {name} {marca}`

Abre en nueva pestaña con `window.open(..., '_blank', 'noopener')`.

---

## Parámetros involucrados

| Nombre | Tipo | Descripción |
|--------|------|-------------|
| `RedondeoPrecios` | select | Ya existe — reutilizado para redondear precios en catálogo |
| `NumeroWhatsAppCatalogo` | text | Nuevo — número en formato internacional (ej: `59170000000`). Requiere insertar fila inicial en tabla `params` vía seeder o migration. |

---

## Seguridad

- Las rutas `/api/catalogo/*` no requieren token
- El endpoint `params` usa whitelist estricta (nunca expone todos los params)
- Rate limiting: `throttle:60,1` (60 req/min por IP)
- Los productos mostrados son solo los que tienen categoría asignada
- No se expone cantidad de stock ni precios de costo

---

## Archivos a crear/modificar

| Archivo | Acción |
|---------|--------|
| `Backend/app/Http/Controllers/CatalogoController.php` | Crear |
| `Backend/routes/api.php` | Modificar — agregar grupo público |
| `Frontend/src/stores/useCatalogoStore.js` | Crear |
| `Frontend/src/views/catalogo/CatalogoHome.js` | Crear |
| `Frontend/src/views/catalogo/CatalogoCategoria.js` | Crear |
| `Frontend/src/views/catalogo/CardCatalogo.js` | Crear |
| `Frontend/src/views/catalogo/ModalCatalogo.js` | Crear |
| `Frontend/src/routers/AppRouter.js` | Modificar — 2 rutas |
| `Frontend/src/views/administrar/ParametrosGenerales.js` | Modificar — campo nuevo |
