import {
  CBadge,
  CButton,
  CCardBody,
  CCardHeader,
  CCarousel,
  // CCarouselControl,
  // CCarouselInner,
  CCarouselItem,
  CCol,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
} from '@coreui/react'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { uiCloseModal } from '../../actions/uiAction'
import { DISK } from '../../types/types'

export const ModalDetalleProducto = (props) => {
  const dispatch = useDispatch()
  const { modalOpen, modalTitle, modalButton, loading } = useSelector((state) => state.ui)
  const { producto } = useSelector((state) => state.productos)

  const CloseModal = () => {
    dispatch(uiCloseModal())
  }

  return (
    <CModal show={modalOpen} onClose={CloseModal} color="primary" closeOnBackdrop={false}>
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
                <CCarousel controls indicators>
                  {producto.images.map((image) => (
                    <CCarouselItem key={image.id}>
                      <img className="d-block w-100" src={`${DISK}/${image.name}`} alt="slide" />
                    </CCarouselItem>
                  ))}
                  {/* <CCarouselInner>
                  </CCarouselInner> */}
                  {/* <CCarouselControl direction="prev"/>
                    <CCarouselControl direction="next"/> */}
                </CCarousel>
              ) : (
                <img width="100%" src={'./img/product_default.png'} alt="img" />
              )}
            </CCardHeader>
            <CCardBody>
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
        <CButton color="secondary" onClick={CloseModal}>
          Cerrar
        </CButton>
      </CModalFooter>
    </CModal>
  )
}
