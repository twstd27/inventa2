import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CSpinner } from '@coreui/react'
import { useCatalogoStore } from '../../stores/useCatalogoStore'

const CatalogoHome = () => {
  const { categories, loading, getCategories, getParams } = useCatalogoStore()
  const navigate = useNavigate()

  useEffect(() => {
    const prev = document.title
    document.title = `${import.meta.env.VITE_APP_NAME} | Catálogo`
    return () => { document.title = prev }
  }, [])

  useEffect(() => {
    getCategories()
    getParams()
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#faf9f6' }}>

      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e8e8e8', padding: '12px 20px' }}>
        <div style={{ maxWidth: 1320, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="/favicon.png" alt="logo" style={{ height: 28, width: 28, objectFit: 'contain' }} />
          <span style={{ fontWeight: 700, fontSize: '1rem', color: '#1a1a1a' }}>
            {import.meta.env.VITE_APP_NAME}
          </span>
        </div>
      </div>

      {/* Hero title */}
      <div style={{ background: '#fff', padding: '32px 20px 26px', textAlign: 'center', borderBottom: '2px solid #1a1a1a' }}>
        <p style={{ fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#888', marginBottom: 8 }}>
          Bienvenido a nuestro
        </p>
        <h1 style={{
          fontWeight: 900,
          fontSize: 'clamp(2rem, 6vw, 3.8rem)',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          margin: 0,
          color: '#1a1a1a',
          lineHeight: 1.1,
        }}>
          Catálogo de Productos
        </h1>
      </div>

      {/* Category count */}
      {!loading && categories.length > 0 && (
        <div style={{ background: '#fff', borderBottom: '1px solid #e8e8e8', padding: '7px 20px' }}>
          <div style={{ maxWidth: 1320, margin: '0 auto' }}>
            <span style={{ fontSize: '0.76rem', color: '#888' }}>{categories.length} categorías</span>
          </div>
        </div>
      )}

      {/* Category grid */}
      <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <CSpinner color="dark" />
          </div>
        ) : (
          <div className="catalogo-home-grid" style={{ borderTop: '1px solid #e8e8e8', borderLeft: '1px solid #e8e8e8' }}>
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="catalogo-home-card"
                onClick={() => navigate(`/catalogo/${cat.slug}`)}
                style={{ borderRight: '1px solid #e8e8e8', borderBottom: '1px solid #e8e8e8' }}
              >
                <div style={{
                  width: 44,
                  height: 44,
                  background: '#f0efeb',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1rem',
                  color: '#1a1a1a',
                  textTransform: 'uppercase',
                }}>
                  {cat.name.charAt(0)}
                </div>
                <span style={{
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  color: '#1a1a1a',
                  textAlign: 'center',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  lineHeight: 1.3,
                }}>
                  {cat.name}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default CatalogoHome
