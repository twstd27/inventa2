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
import { useUIStore } from '../../stores/useUIStore'
import { useProductosStore } from '../../stores/useProductosStore'
import { useParamsStore } from '../../stores/useParamsStore'
import CIcon from '@coreui/icons-react'
import { cilTag, cilPrint } from '@coreui/icons'
import { Sparkles, Tag, Package, Hash } from 'lucide-react'
import { roundPrice } from '../../helpers/global'

export const ModalDetalleProducto = (props) => {
  const { modalOpen, modalTitle, modalButton, closeModal, openProductoEtiquetaModal } = useUIStore()
  const loading = useUIStore((s) => s.loadingCount > 0)
  const { producto } = useProductosStore()
  const { params } = useParamsStore()

  const DISK = import.meta.env.VITE_DISK_URL

  const redondeo = Number(params.find((p) => p.name === 'RedondeoPrecios')?.value ?? 0)

  const CloseModal = () => closeModal()

  const openModalEtiqueta = () => {
    closeModal()
    setTimeout(() => {
      openProductoEtiquetaModal(
        <span><CIcon icon={cilTag} /> Etiqueta</span>,
        <span><CIcon icon={cilPrint} /> Imprimir Etiqueta</span>,
        'modificar',
      )
    }, 150)
  }

  return (
    <CModal visible={modalOpen} onClose={CloseModal} color="primary" size="lg">
      <CModalHeader closeButton>
        <CModalTitle className="d-flex align-items-center gap-2">
          <Package size={18} />
          {modalTitle}
        </CModalTitle>
      </CModalHeader>

      <CModalBody className="p-0">
        <CRow className="g-0">
          {/* Imagen / carrusel */}
          <CCol xs="12" md="5" className="position-relative">
            {producto?.images.length > 0 ? (
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
            <CButton
              color="dark"
              variant="ghost"
              size="sm"
              title="Consultar en ChatGPT"
              className="position-absolute top-0 end-0 m-2 p-1 bg-dark bg-opacity-50 text-white border-0"
              style={{ zIndex: 10 }}
              onClick={(e) => {
                e.stopPropagation()
                const query = encodeURIComponent(`dame más informacion sobre el producto: ${producto?.marca} ${producto?.code} ${producto?.name}`)
                navigator.clipboard?.writeText(`dame más informacion sobre el producto: ${producto?.marca} ${producto?.code} ${producto?.name}`).catch(() => {})
                window.open(`https://chatgpt.com/?q=${query}`, '_blank', 'noopener')
              }}
            >
              <Sparkles size={14} />
            </CButton>
          </CCol>

          {/* Info */}
          <CCol xs="12" md="7" className="p-3 d-flex flex-column gap-3">

            {/* Categorías */}
            {producto?.categories?.length > 0 && (
              <div className="d-flex flex-wrap gap-1">
                {producto.categories.map((cat, i) => (
                  <CBadge key={i} color="primary" className="fw-normal">{cat.label}</CBadge>
                ))}
              </div>
            )}

            {/* Código + Nombre + Marca */}
            <div>
              <div className="d-flex align-items-center gap-1 text-muted mb-1" style={{ fontSize: '0.78rem' }}>
                <Hash size={13} /> {producto?.code}
              </div>
              <h5 className="fw-bold mb-1 lh-sm">{producto?.name}</h5>
              {producto?.marca && (
                <div className="d-flex align-items-center gap-1 text-secondary" style={{ fontSize: '0.85rem' }}>
                  <Tag size={13} /> {producto.marca}
                </div>
              )}
            </div>

            {/* Descripción */}
            {producto?.description && (
              <div className="p-2 rounded" style={{ background: 'var(--cui-secondary-bg)', fontSize: '0.85rem', lineHeight: '1.5' }}>
                {producto.description}
              </div>
            )}

            {/* Precios */}
            <div>
              <div className="fw-semibold text-muted mb-2" style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Precios</div>
              <div className="d-flex gap-2">
                <div className="flex-fill text-center p-2 rounded border">
                  <div className="text-muted" style={{ fontSize: '0.70rem' }}>Normal</div>
                  <div className="fw-bold text-success" style={{ fontSize: '1.1rem' }}>
                    Bs {roundPrice(Number(producto?.price) || 0, redondeo)}
                  </div>
                </div>
                <div className="flex-fill text-center p-2 rounded border">
                  <div className="text-muted" style={{ fontSize: '0.70rem' }}>Descuento</div>
                  <div className="fw-bold text-warning" style={{ fontSize: '1.1rem' }}>
                    Bs {roundPrice(Number(producto?.price_discount) || 0, redondeo)}
                  </div>
                </div>
                <div className="flex-fill text-center p-2 rounded border">
                  <div className="text-muted" style={{ fontSize: '0.70rem' }}>Al por mayor</div>
                  <div className="fw-bold text-info" style={{ fontSize: '1.1rem' }}>
                    Bs {roundPrice(Number(producto?.price_wholesome) || 0, redondeo)}
                  </div>
                </div>
              </div>
            </div>

          </CCol>
        </CRow>
      </CModalBody>

      <CModalFooter>
        {modalButton !== '' && (
          <CButton onClick={() => props.action(producto)} color="primary" disabled={loading}>
            {loading ? <i className="fa fa-spinner fa-spin" /> : <span>{modalButton}</span>}
          </CButton>
        )}{' '}
        <CButton color="primary" variant="outline" onClick={openModalEtiqueta}>
          <CIcon icon={cilTag} /> Etiqueta
        </CButton>
        <CButton color="secondary" onClick={CloseModal}>
          Cerrar
        </CButton>
      </CModalFooter>
    </CModal>
  )
}
