import {
  CButton,
  CCol,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CFormTextarea,
} from '@coreui/react'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { uiCloseModal } from '../../actions/uiAction'
import html2canvas from 'html2canvas'
import Barcode from 'react-barcode'

// const Barcode = require('react-barcode')

export const ModalEtiqueta = () => {
  const dispatch = useDispatch()
  const { modalProductoEtiquetaOpen, modalTitle, modalButton, loading } = useSelector(
    (state) => state.ui,
  )
  const { producto } = useSelector((state) => state.productos)

  const { name, description, code, price } = producto

  const CloseModal = () => {
    dispatch(uiCloseModal())
  }

  const handleClick = () => {
    const element = document.getElementById('etiqueta')

    html2canvas(element).then(function (canvas) {
      saveAs(canvas.toDataURL(), `${code}.png`)
    })
  }

  const saveAs = (uri, filename) => {
    let link = document.createElement('a')

    if (typeof link.download === 'string') {
      link.href = uri
      link.download = filename

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      CloseModal()
    } else {
      window.open(uri)
    }
  }

  return (
    <CModal visible={modalProductoEtiquetaOpen} onClose={CloseModal} color="primary">
      <CModalHeader className="bg-primary text-white" closeButton>
        <CModalTitle>{modalTitle}</CModalTitle>
      </CModalHeader>
      <CModalBody className={'bg-tag'} id="etiqueta">
        <CRow>
          <CCol xs="12" className={'div-tag'}>
            <CFormTextarea
              className={'input-tag'}
              label="Nombre"
              defaultValue={name === null ? '' : name}
              name="name"
              rows="1"
            />
            <CFormTextarea
              className={'input-tag'}
              label="Código"
              defaultValue={code === null ? '' : code}
              name="code"
              rows="1"
            />
            <CFormTextarea
              className={'input-tag'}
              label="Precio"
              defaultValue={price === null ? '' : price}
              name="price"
              rows="1"
            />
            <CFormTextarea
              defaultValue={description === null ? '' : description}
              label="Descripción"
              name="description"
              rows="3"
            />
          </CCol>
          <CCol xs="12">
            <div className="d-flex justify-content-center">
              <Barcode displayValue={false} value={code || 'sin codigo'} />
            </div>
          </CCol>
        </CRow>
      </CModalBody>
      <CModalFooter>
        <CButton color="primary" disabled={loading} onClick={handleClick}>
          {loading && (
            <div className="spinner-border text-light spinner-border-sm" role="status">
              <span className="visually-hidden">cargando...</span>
            </div>
          )}
          {!loading && <span> {modalButton}</span>}
        </CButton>{' '}
        <CButton color="secondary" onClick={CloseModal}>
          Cancelar
        </CButton>
      </CModalFooter>
    </CModal>
  )
}
