import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CCard, CCardBody, CCol, CContainer, CRow, CSpinner } from '@coreui/react'
import { Package } from 'lucide-react'
import { useCatalogoStore } from '../../stores/useCatalogoStore'

const CatalogoHome = () => {
  const { categories, loading, getCategories } = useCatalogoStore()
  const navigate = useNavigate()

  useEffect(() => {
    getCategories()
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cui-body-bg)' }}>
      <div style={{ background: '#2c3e50', color: 'white', padding: '16px 20px' }}>
        <div className="d-flex align-items-center gap-2">
          <img src="/favicon.png" alt="logo" style={{ height: '26px', width: '26px', objectFit: 'contain' }} />
          <span style={{ fontSize: '1.15rem', fontWeight: 700 }}>
            {import.meta.env.VITE_APP_NAME} | Catálogo de Productos
          </span>
        </div>
      </div>

      <CContainer className="py-4">
        {loading ? (
          <div className="text-center py-5">
            <CSpinner color="primary" />
          </div>
        ) : (
          <CRow className="g-2">
            {categories.map((cat) => (
              <CCol key={cat.id} xs="6" sm="4" md="3" lg="2">
                <CCard
                  className="h-100 text-center"
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/catalogo/${cat.slug}`)}
                >
                  <CCardBody className="d-flex flex-column align-items-center justify-content-center gap-2 py-3">
                    <Package size={28} color="#0d6efd" />
                    <span style={{ fontWeight: 600, fontSize: '0.88rem', color: '#212529' }}>{cat.name}</span>
                  </CCardBody>
                </CCard>
              </CCol>
            ))}
          </CRow>
        )}
      </CContainer>
    </div>
  )
}

export default CatalogoHome
