import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CContainer, CRow, CSpinner } from '@coreui/react'
import { ChevronLeft } from 'lucide-react'
import { useCatalogoStore } from '../../stores/useCatalogoStore'
import { CardCatalogo } from './CardCatalogo'
import { ModalCatalogo } from './ModalCatalogo'

const CatalogoCategoria = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { products, params, loading, loadingMore, hasMore, page, getProducts, getParams, resetProducts } = useCatalogoStore()
  const [selectedProduct, setSelectedProduct] = useState(null)
  const loaderRef = useRef(null)

  const redondeo = Number(params.RedondeoPrecios ?? 0)
  const waNumber = params.NumeroWhatsAppCatalogo ?? ''

  const categoryName = products[0]?.categories?.find(() => true)
    ? null
    : null

  useEffect(() => {
    resetProducts()
    getParams()
    getProducts(slug, 1)
  }, [slug])

  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      getProducts(slug, page + 1)
    }
  }, [loadingMore, hasMore, slug, page])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) loadMore() },
      { threshold: 0.1 },
    )
    if (loaderRef.current) observer.observe(loaderRef.current)
    return () => observer.disconnect()
  }, [loadMore])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cui-body-bg)' }}>
      <div style={{ background: '#2c3e50', color: 'white', padding: '12px 20px' }}>
        <div className="d-flex align-items-center gap-3">
          <button
            onClick={() => navigate('/catalogo')}
            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.8)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, padding: 0 }}
          >
            <ChevronLeft size={16} />
            <span style={{ fontSize: '0.83rem' }}>Catálogo</span>
          </button>
          <img src="/favicon.png" alt="logo" style={{ height: '22px', width: '22px', objectFit: 'contain' }} />
          <span style={{ fontWeight: 700, fontSize: '1.05rem', textTransform: 'capitalize' }}>
            {import.meta.env.VITE_APP_NAME} | {slug.replace(/-/g, ' ')}
          </span>
        </div>
      </div>

      <CContainer fluid className="py-3">
        {loading ? (
          <div className="text-center py-5">
            <CSpinner color="primary" />
          </div>
        ) : (
          <>
            <CRow className="g-0">
              {products.map((product) => (
                <CardCatalogo
                  key={product.id}
                  product={product}
                  redondeo={redondeo}
                  waNumber={waNumber}
                  onDetalle={setSelectedProduct}
                />
              ))}
            </CRow>

            <div ref={loaderRef} className="text-center py-3">
              {loadingMore && <CSpinner size="sm" color="primary" />}
            </div>
          </>
        )}
      </CContainer>

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
