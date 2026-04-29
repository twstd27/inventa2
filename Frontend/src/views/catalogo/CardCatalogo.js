import React, { memo } from 'react'
import { CCard, CCardBody, CCardImage, CCardText, CCol, CButton } from '@coreui/react'
import { Tag } from 'lucide-react'
import CIcon from '@coreui/icons-react'
import { cibWhatsapp } from '@coreui/icons'
import { DISK } from '../../types/types'
import { roundPrice } from '../../helpers/global'

export const CardCatalogo = memo(({ product, redondeo = 0, waNumber, onDetalle }) => {
  const precio = roundPrice(Number(product?.price) || 0, redondeo)

  const openWhatsApp = (e) => {
    e.stopPropagation()
    const text = `Hola, quisiera consultar sobre la disponibilidad del producto: ${product.code} | ${product.name} | ${product.marca}`
    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`, '_blank', 'noopener')
  }

  return (
    <CCol xs="6" lg="4" xl="3" className="p-1">
      <CCard className="mb-1 h-100" style={{ cursor: 'pointer' }}>
        <CCardImage
          style={{ height: '110px', objectFit: 'cover', objectPosition: 'center' }}
          onClick={() => onDetalle(product)}
          src={
            product?.images?.length > 0
              ? `${DISK}/${product.images[0].name}`
              : './img/product_default.png'
          }
          alt="img"
          loading="lazy"
          onError={(e) => { e.target.src = './img/product_default.png' }}
        />

        <CCardBody className="p-2 d-flex flex-column gap-1">
          <div onClick={() => onDetalle(product)}>
            <div className="text-primary fw-bold" style={{ fontSize: '0.72rem' }}>{product?.code}</div>
            <div className="fw-semibold lh-sm" style={{ fontSize: '0.80rem', color: '#212529' }}>{product?.name}</div>
            {product?.marca ? (
              <div className="d-flex align-items-center gap-1" style={{ fontSize: '0.72rem', color: '#495057' }}>
                <Tag size={11} /> {product.marca}
              </div>
            ) : null}
          </div>

          <div className="d-flex justify-content-between align-items-center mt-auto pt-1">
            <span className="fw-bold text-success" style={{ fontSize: '0.95rem' }}>
              Bs <span style={{ fontSize: '1.05rem' }}>{precio}</span>
            </span>
            {waNumber && (
              <CButton
                style={{ background: '#25D366', border: 'none', color:'white' }}
                shape="square"
                size="sm"
                onClick={openWhatsApp} 
                
                title="Consultar por WhatsApp"
              >
                <CIcon icon={cibWhatsapp} size={'sm'} />
              </CButton>
            )}
          </div>
        </CCardBody>
      </CCard>
    </CCol>
  )
})

CardCatalogo.displayName = 'CardCatalogo'
