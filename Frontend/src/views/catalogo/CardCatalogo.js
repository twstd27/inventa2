import React, { memo } from 'react'
import CIcon from '@coreui/icons-react'
import { cibWhatsapp } from '@coreui/icons'
import { DISK } from '../../types/types'
import { roundPrice } from '../../helpers/global'

export const CardCatalogo = memo(({ product, redondeo = 0, waNumber, onDetalle }) => {
  const precio = roundPrice(Number(product?.price) || 0, redondeo)

  const openWhatsApp = (e) => {
    e.stopPropagation()
    const text = `Hola, quisiera consultar sobre la disponibilidad del producto: ${product.code} | ${product.name}${product.marca ? ` | ${product.marca}` : ''}`
    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`, '_blank', 'noopener')
  }

  const imgSrc = product?.images?.length > 0
    ? `${DISK}/${product.images[0].name}`
    : './img/product_default.png'

  return (
    <div className="catalogo-card" style={{border: '1px solid #cecece'}}>
      {/* Image + marca badge */}
      <div className="catalogo-card__img-wrap">
        <div className="catalogo-card__img" onClick={() => onDetalle(product)}>
          <img
            src={imgSrc}
            alt={product.name}
            loading="lazy"
            onError={(e) => { e.target.src = './img/product_default.png' }}
          />
        </div>
        {product.marca && (
          <div className="catalogo-card__marca-badge">{product.marca}</div>
        )}
      </div>

      {/* Content */}
      <div className="catalogo-card__body">
        <div className="catalogo-card__name" onClick={() => onDetalle(product)}>
          {product.name}
        </div>

        {product.code && (
          <div className="catalogo-card__code">#{product.code}</div>
        )}

        <div className="catalogo-card__price-label">Precio</div>
        <div className="catalogo-card__price">Bs {precio}</div>

        <div className="catalogo-card__actions">
          {waNumber && (
            <button className="catalogo-card__wa" onClick={openWhatsApp}>
              <CIcon icon={cibWhatsapp} style={{ width: 15, height: 15 }} />
              Consultar por WhatsApp
            </button>
          )}
          <button className="catalogo-card__detalle" onClick={() => onDetalle(product)}>
            Ver detalles
          </button>
        </div>
      </div>
    </div>
  )
})

CardCatalogo.displayName = 'CardCatalogo'
