import React from 'react'
import {
  CBadge,
  CButton,
  CCarousel,
  CCarouselItem,
  CCol,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { Hash, MessageCircle, Package, Tag } from 'lucide-react'
import { roundPrice } from '../../helpers/global'
import { cibWhatsapp } from '@coreui/icons'

const DISK = import.meta.env.VITE_DISK_URL

export const ModalCatalogo = ({ visible, producto, onClose, waNumber, redondeo = 0 }) => {
  if (!producto) return null

  const precio = roundPrice(Number(producto?.price) || 0, redondeo)

  const openWhatsApp = () => {
    const text = `Hola, quisiera consultar sobre la disponibilidad del producto: ${producto.code} | ${producto.name} | ${producto.marca}`
    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`, '_blank', 'noopener')
  }

  return (
    <CModal visible={visible} onClose={onClose} size="lg">
      <CModalHeader closeButton>
        <CModalTitle className="d-flex align-items-center gap-2">
          <Package size={18} />
          {producto.name}
        </CModalTitle>
      </CModalHeader>

      <CModalBody className="p-0">
        <CRow className="g-0">
          <CCol xs="12" md="5">
            {producto.images?.length > 0 ? (
              <CCarousel controls indicators interval={false}>
                {producto.images.map((image) => (
                  <CCarouselItem key={image.id}>
                    <img
                      className="d-block w-100"
                      style={{ maxHeight: '320px', objectFit: 'cover' }}
                      src={`${DISK}/${image.name}`}
                      alt="slide"
                      onError={(e) => { e.target.src = './img/product_default.png' }}
                    />
                  </CCarouselItem>
                ))}
              </CCarousel>
            ) : (
              <img
                width="100%"
                style={{ maxHeight: '320px', objectFit: 'cover' }}
                src="./img/product_default.png"
                alt="img"
              />
            )}
          </CCol>

          <CCol xs="12" md="7" className="p-3 d-flex flex-column gap-3">
            {producto.categories?.length > 0 && (
              <div className="d-flex flex-wrap gap-1">
                {producto.categories.map((cat, i) => (
                  <CBadge key={i} color="primary" className="fw-normal">{cat.label}</CBadge>
                ))}
              </div>
            )}

            <div>
              <div className="d-flex align-items-center gap-1 mb-1" style={{ fontSize: '0.78rem', color: '#495057' }}>
                <Hash size={13} /> {producto.code}
              </div>
              <h5 className="fw-bold mb-1 lh-sm" style={{ color: '#212529' }}>{producto.name}</h5>
              {producto.marca && (
                <div className="d-flex align-items-center gap-1" style={{ fontSize: '0.85rem', color: '#495057' }}>
                  <Tag size={13} /> {producto.marca}
                </div>
              )}
            </div>

            {producto.description && (
              <div className="p-2 rounded" style={{ background: 'var(--cui-secondary-bg)', fontSize: '0.85rem', lineHeight: '1.5' }}>
                {producto.description}
              </div>
            )}

            <div className="text-center p-2 rounded border">
              <div style={{ fontSize: '0.70rem', color: '#6c757d', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Precio</div>
              <div className="fw-bold text-success" style={{ fontSize: '1.3rem' }}>Bs {precio}</div>
            </div>

            {waNumber && (
              <CButton
                style={{ background: '#25D366', border: 'none', color: 'white' }}
                className="d-flex align-items-center justify-content-center gap-2"
                onClick={openWhatsApp}
              >
                <CIcon icon={cibWhatsapp} />
                Consultar por WhatsApp
              </CButton>
            )}
          </CCol>
        </CRow>
      </CModalBody>

      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>Cerrar</CButton>
      </CModalFooter>
    </CModal>
  )
}
