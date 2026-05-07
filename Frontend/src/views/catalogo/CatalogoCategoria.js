import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CSpinner } from '@coreui/react'
import { ChevronLeft, SlidersHorizontal, X } from 'lucide-react'
import { useCatalogoStore } from '../../stores/useCatalogoStore'
import { CardCatalogo } from './CardCatalogo'
import { ModalCatalogo } from './ModalCatalogo'

const CatalogoCategoria = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { products, params, loading, loadingMore, hasMore, page, getProducts, getParams, resetProducts } = useCatalogoStore()
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedBrand, setSelectedBrand] = useState(null)
  const [mobileSidebar, setMobileSidebar] = useState(false)
  const loaderRef = useRef(null)

  const redondeo = Number(params.RedondeoPrecios ?? 0)
  const waNumber = params.NumeroWhatsAppCatalogo ?? ''
  const categoryTitle = slug.replace(/-/g, ' ')

  useEffect(() => {
    const prev = document.title
    document.title = `${import.meta.env.VITE_APP_NAME} | Catálogo`
    return () => { document.title = prev }
  }, [])

  useEffect(() => {
    resetProducts()
    setSelectedBrand(null)
    getParams()
    getProducts(slug, 1)
  }, [slug])

  const loadMore = useCallback(() => {
    if (!loading && !loadingMore && hasMore) {
      getProducts(slug, page + 1)
    }
  }, [loading, loadingMore, hasMore, slug, page])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) loadMore() },
      { threshold: 0.1 },
    )
    if (loaderRef.current) observer.observe(loaderRef.current)
    return () => observer.disconnect()
  }, [loadMore])

  const brands = useMemo(() => {
    const set = new Set()
    products.forEach((p) => { if (p.marca) set.add(p.marca) })
    return [...set].sort()
  }, [products])

  const filteredProducts = useMemo(() => {
    if (!selectedBrand) return products
    return products.filter((p) => p.marca === selectedBrand)
  }, [products, selectedBrand])

  return (
    <div style={{ minHeight: '100vh', background: '#faf9f6' }}>

      {/* Top bar */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e8e8e8', padding: '10px 20px' }}>
        <div style={{ maxWidth: 1320, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src="/favicon.png" alt="logo" style={{ height: 26, width: 26, objectFit: 'contain' }} />
          <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1a1a1a' }}>
            {import.meta.env.VITE_APP_NAME}
          </span>
          <button
            onClick={() => navigate('/catalogo')}
            style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#555', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3, fontSize: '0.82rem' }}
          >
            <ChevronLeft size={14} />
            Catálogo
          </button>
        </div>
      </div>

      {/* Category title */}
      <div style={{ background: '#fff', padding: '28px 20px 22px', textAlign: 'center', borderBottom: '2px solid #1a1a1a' }}>
        <h1 style={{
          fontWeight: 900,
          fontSize: 'clamp(1.8rem, 5vw, 3.2rem)',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          margin: 0,
          color: '#1a1a1a',
        }}>
          {categoryTitle}
        </h1>
      </div>

      {/* Count + filter bar */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e8e8e8', padding: '8px 20px' }}>
        <div style={{ maxWidth: 1320, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.78rem', color: '#888' }}>
            {filteredProducts.length}{hasMore && !selectedBrand ? '+' : ''} productos
          </span>

          {selectedBrand && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#1a1a1a', color: '#fff', borderRadius: 2, padding: '2px 8px', fontSize: '0.74rem' }}>
              {selectedBrand}
              <button
                onClick={() => setSelectedBrand(null)}
                style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 0, display: 'flex', lineHeight: 1 }}
              >
                <X size={11} />
              </button>
            </div>
          )}

          {brands.length > 0 && (
            <button
              onClick={() => setMobileSidebar(true)}
              style={{
                marginLeft: 'auto',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                background: 'none',
                border: '1px solid #ccc',
                padding: '4px 11px',
                fontSize: '0.78rem',
                cursor: 'pointer',
                color: '#333',
              }}
              className="d-md-none"
            >
              <SlidersHorizontal size={13} />
              Filtros
            </button>
          )}
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {mobileSidebar && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 199 }}
          onClick={() => setMobileSidebar(false)}
        />
      )}

      <div className="catalogo-layout">
        {/* Sidebar */}
        {brands.length > 0 && (
          <aside className={`catalogo-sidebar${mobileSidebar ? ' open' : ''}`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <span style={{ fontWeight: 800, fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#1a1a1a' }}>
                Filtrar por
              </span>
              {selectedBrand && (
                <button
                  onClick={() => setSelectedBrand(null)}
                  style={{ background: 'none', border: 'none', fontSize: '0.72rem', color: '#888', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Limpiar
                </button>
              )}
              <button
                onClick={() => setMobileSidebar(false)}
                className="d-md-none"
                style={{ background: 'none', border: 'none', cursor: 'pointer', marginLeft: 'auto', color: '#555' }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ fontWeight: 800, fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10, color: '#1a1a1a' }}>
              Marca
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {brands.map((brand) => (
                <label key={brand} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.82rem', color: selectedBrand === brand ? '#1a1a1a' : '#555', fontWeight: selectedBrand === brand ? 700 : 400 }}>
                  <input
                    type="radio"
                    name="brand"
                    checked={selectedBrand === brand}
                    onChange={() => { setSelectedBrand(brand); setMobileSidebar(false) }}
                    style={{ cursor: 'pointer', accentColor: '#1a1a1a' }}
                  />
                  {brand}
                </label>
              ))}
            </div>
          </aside>
        )}

        {/* Product grid */}
        <main style={{ flex: 1, minWidth: 0 }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <CSpinner color="dark" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#888', fontSize: '0.9rem' }}>
              No hay productos en esta categoría.
            </div>
          ) : (
            <div className="catalogo-grid">
              {filteredProducts.map((product) => (
                <CardCatalogo
                  key={product.id}
                  product={product}
                  redondeo={redondeo}
                  waNumber={waNumber}
                  onDetalle={setSelectedProduct}
                />
              ))}
            </div>
          )}

          <div ref={loaderRef} style={{ textAlign: 'center', padding: '24px 0' }}>
            {loadingMore && <CSpinner size="sm" color="dark" />}
          </div>
        </main>
      </div>

      <ModalCatalogo
        visible={!!selectedProduct}
        producto={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        waNumber={waNumber}
        redondeo={redondeo}
      />
    </div>
  )
}

export default CatalogoCategoria
