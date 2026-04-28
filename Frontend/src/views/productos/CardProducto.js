import React, { useState, memo } from 'react'
import {
  CCard,
  CCardBody,
  CCardText,
  CCol,
  CCardImage,
  CCardImageOverlay,
  CButton,
} from '@coreui/react'
import { DISK } from '../../types/types'
import { ShoppingCart, Warehouse, Sparkles, Tag } from 'lucide-react'
import { roundPrice } from '../../helpers/global'

export const CardProducto = memo((props) => {
  const [state] = useState({ producto: props.producto })
  const { producto: product } = state
  const redondeo = props.redondeo ?? 0

  const precio = roundPrice(Number(product?.price) || 0, redondeo)

  return (
    <CCol xs="6" lg="4" xl="3" className="p-1">
      <CCard className="mb-1 h-100">
        <CCardImage
          className="bg-subtle cursor-zoom-in"
          style={{
            height: '110px',
            overflow: 'hidden',
            objectFit: 'cover',
            objectPosition: 'center',
          }}
          onClick={() => props.modal(product)}
          src={
            product?.images.length > 0
              ? `${DISK}/${product.images[0].name}`
              : './img/product_default.png'
          }
          alt="img"
          loading="lazy"
          onError={(e) => {
            e.target.src = './img/product_default.png'
          }}
        />
        <CCardImageOverlay className="d-flex flex-column justify-content-end align-items-end p-0 position-relative">
          <CButton
            color="dark"
            variant="ghost"
            size="sm"
            title="Consultar en ChatGPT"
            className="position-absolute top-0 end-0 m-1 p-1 bg-dark bg-opacity-50 text-white border-0"
            onClick={(e) => {
              e.stopPropagation()
              const query = encodeURIComponent(`dame más informacion sobre el producto:  ${product.marca} ${product.code} ${product.name}`)
              navigator.clipboard?.writeText(`dame más informacion sobre el producto:  ${product.marca} ${product.code} ${product.name}`).catch(() => {})
              window.open(`https://chatgpt.com/?q=${query}`, '_blank', 'noopener')
            }}
          >
            <Sparkles size={14} />
          </CButton>
          <CCardText
            className={`${product.quantity === '0.00' ? 'text-danger' : 'text-white'} bg-opacity-75 bg-primary px-2 py-1 fw-bold position-absolute end-0 bottom-0`}
          >
            <Warehouse size={14} className="mb-1" /> {product.quantity}
          </CCardText>
        </CCardImageOverlay>

        <CCardBody className="p-2 d-flex flex-column gap-1">
          <div>
            <div className="text-primary fw-bold" style={{ fontSize: '0.75rem' }}>{product?.code}</div>
            <div className="fw-semibold lh-sm" style={{ fontSize: '0.80rem' }}>{product?.name}</div>
            {product?.marca ? (
              <div className="d-flex align-items-center gap-1 text-secondary" style={{ fontSize: '0.7rem' }}>
                <Tag size={13} /> {product.marca}
              </div>
            ) : null}
          </div>

          <div className="d-flex justify-content-between align-items-center mt-auto pt-1">
            <span className="fw-bold text-success" style={{ fontSize: '0.95rem' }}>
              Bs <span style={{ fontSize: '1.05rem' }}>{precio}</span>
            </span>
            <CButton
              color="primary"
              shape="square"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                props.agregar(product)
              }}
            >
              <ShoppingCart size={15} />
            </CButton>
          </div>
        </CCardBody>
      </CCard>
    </CCol>
  )
})

CardProducto.displayName = 'CardProducto'
