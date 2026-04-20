import {
  CBadge,
  CButton,
  CCardBody,
  CCardHeader,
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
import CIcon from '@coreui/icons-react'
import { cilTag, cilPrint } from '@coreui/icons'
import { Sparkles } from 'lucide-react'

export const ModalDetalleProducto = (props) => {
  const { modalOpen, modalTitle, modalButton, closeModal, openProductoEtiquetaModal } = useUIStore()
  const loading = useUIStore((s) => s.loadingCount > 0)
  const { producto } = useProductosStore()

  const DISK = import.meta.env.VITE_DISK_URL

  const CloseModal = () => {
    closeModal()
  }

  const openModalEtiqueta = () => {
    closeModal()

    setTimeout(() => {
      openProductoEtiquetaModal(
        <span>
          <CIcon icon={cilTag} /> Etiqueta
        </span>,
        <span>
          <CIcon icon={cilPrint} /> Imprimir Etiqueta
        </span>,
        'modificar',
      )
    }, 150)
  }

  return (
    <CModal visible={modalOpen} onClose={CloseModal} color="primary">
      <CModalHeader closeButton>
        <CModalTitle>{modalTitle}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CRow>
          <CCol xs="12">
            <CCardHeader className="p-0">
              <div className="float-right">
                {producto?.categories.map((category, i) => (
                  <CBadge className="mr-1" key={i} color="primary">
                    {category.label}
                  </CBadge>
                ))}
              </div>
              {producto?.images.length > 0 ? (
                <CCarousel controls indicators interval={false}>
                  {producto.images.map((image) => (
                    <CCarouselItem key={image.id}>
                      <img className="d-block w-100" src={`${DISK}/${image.name}`} alt="slide" onError={(e) => { e.target.src = './img/product_default.png' }} />
                    </CCarouselItem>
                  ))}
                </CCarousel>
              ) : (
                <img width="100%" src={'./img/product_default.png'} alt="img" />
              )}
            </CCardHeader>
            <CCardBody>
              <CButton
                color="dark"
                variant="ghost"
                size="sm"
                title="Consultar en ChatGPT"
                className="position-absolute top-0 end-0 m-1 p-1 bg-dark bg-opacity-50 text-white border-0"
                onClick={(e) => {
                  e.stopPropagation()
                  const query = encodeURIComponent(`dame más informacion sobre el producto:  ${producto?.marca} ${producto?.code} ${producto?.name}`)
                  navigator.clipboard?.writeText(`dame más informacion sobre el producto:  ${producto?.marca} ${producto?.code} ${producto?.name}`).catch(() => {})
                  window.open(`https://chatgpt.com/?q=${query}`, '_blank', 'noopener')
                }}
              >
                <Sparkles size={14} />
              </CButton>
              <table className="w-100 table-sm">
                <tbody>
                  <tr>
                    <th>Código</th>
                    <td colSpan="2">{producto?.code}</td>
                  </tr>
                  <tr>
                    <th>Nombre</th>
                    <td colSpan="2">{producto?.name}</td>
                  </tr>
                  <tr>
                    <th>Marca</th>
                    <td colSpan="2">{producto?.marca}</td>
                  </tr>
                  <tr>
                    <th colSpan="3" className="text-center table-primary border">
                      Precio
                    </th>
                  </tr>
                  <tr>
                    <th width="33%" className="text-center table-primary border">
                      Normal
                    </th>
                    <th width="33%" className="text-center table-primary border">
                      Con descuento
                    </th>
                    <th width="33%" className="text-center table-primary border">
                      Al por mayor
                    </th>
                  </tr>
                  <tr>
                    <td className="border text-center font-weight-bold">{producto?.price}</td>
                    <td className="border text-center font-weight-bold">
                      {producto?.price_discount}
                    </td>
                    <td className="border text-center font-weight-bold">
                      {producto?.price_wholesome}
                    </td>
                  </tr>
                </tbody>
              </table>
            </CCardBody>
          </CCol>
        </CRow>
      </CModalBody>
      <CModalFooter>
        {modalButton !== '' && (
          <CButton
            onClick={() => {
              props.action(producto)
            }}
            color="primary"
            disabled={loading}
          >
            {loading ? <i className="fa fa-spinner fa-spin" /> : <span> {modalButton}</span>}
          </CButton>
        )}{' '}
        <CButton color="primary" onClick={openModalEtiqueta}>
          <CIcon icon={cilTag} /> Etiqueta
        </CButton>
        <CButton color="secondary" onClick={CloseModal}>
          Cerrar
        </CButton>
      </CModalFooter>
    </CModal>
  )
}
