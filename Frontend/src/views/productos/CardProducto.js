import React, { useState, memo } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCardText,
  CCol,
  CCardImage,
  CCardFooter,
  CCardImageOverlay,
  CButton,
  CPopover,
} from '@coreui/react'
import { DISK } from '../../types/types'
import { ShoppingCart, Warehouse, Sparkles } from 'lucide-react'

export const CardProducto = memo((props) => {
  const [state] = useState({ producto: props.producto })
  const { producto: product } = state

  return (
    <CCol xs="6" lg="4" xl="3" className="p-1">
      <CCard className="mb-1">
        <CCardImage
          className="bg-subtle cursor-zoom-in"
          style={{
            height: '120px',
            overflow: 'hidden',
            objectFit: 'cover',
            objectPosition: 'center',
          }}
          onClick={() => {
            props.modal(product)
          }}
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
            <Warehouse size={16} className="mb-1" /> {product.quantity}
          </CCardText>
        </CCardImageOverlay>
        <CCardBody className="p-1">
          <CCardText className="text-primary m-0">
            <b>{product?.code}</b>
            <br />
            <span className="small">{product?.name}</span>
          </CCardText>
          <div className="d-flex justify-content-between align-items-center">
            <div className="card-header-actions text-start">
              <span>
                <b> Bs </b>
                <span className="text-xl">
                  <b>{product?.price}</b>
                </span>
              </span>
            </div>
            <div className="card-header-actions text-end">
              <CButton
                color="primary"
                shape="square"
                onClick={(e) => {
                  e.stopPropagation()
                  props.agregar(product)
                }}
              >
                <ShoppingCart size={16} />
              </CButton>
            </div>
          </div>
        </CCardBody>
      </CCard>
    </CCol>
  )
})

CardProducto.displayName = 'CardProducto'
