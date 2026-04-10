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
  CFormInput,
  CInputGroupText,
} from '@coreui/react'
import React, { useRef, useState, useEffect } from 'react'
import { useUIStore } from '../../stores/useUIStore'
import { useProductosStore } from '../../stores/useProductosStore'
import html2canvas from 'html2canvas'
import { QRCodeSVG } from 'qrcode.react'
import { useReactToPrint } from 'react-to-print'

export const ModalEtiqueta = () => {
  const componentRef = useRef(null)

  const { modalProductoEtiquetaOpen, modalTitle, modalButton, closeModal } = useUIStore()
  const loading = useUIStore((s) => s.loadingCount > 0)
  const { producto } = useProductosStore()

  const { name, description, code, price } = producto

  const [precioEtiqueta, setPrecioEtiqueta] = useState(price)

  useEffect(() => {
    setPrecioEtiqueta(price)
  }, [price])

  const CloseModal = () => {
    closeModal()
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

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `tag_${name}`,
  })

  return (
    <CModal visible={modalProductoEtiquetaOpen} onClose={CloseModal} color="primary">
      <CModalHeader className="bg-primary text-white" closeButton>
        <CModalTitle>{modalTitle}</CModalTitle>
      </CModalHeader>
      <CModalBody className="p-2">
        <div ref={componentRef} id="etiqueta">
          <div
            className="articulo_etiqueta"
            style={{ backgroundColor: '#cecece', padding: '2px', marginBottom: '5px' }}
          >
            <b>
              {`${code} |` || ''} {name || ''}
            </b>
          </div>
          <CRow>
            <CCol xs="4">
              <div className="d-flex justify-content-center">
                <QRCodeSVG value={code || 'sin codigo'} className="barcode_etiqueta" />
              </div>
            </CCol>
            <CCol xs="8" className="d-flex justify-content-center align-items-center fw-bold">
              <CFormInput
                plainText
                value={precioEtiqueta}
                onChange={(e) => {
                  setPrecioEtiqueta(e.target.value)
                }}
                className="precio_etiqueta"
                style={{ textAlign: 'right', fontWeight: 'bold' }}
              />
              <span className="moneda_etiqueta">Bs. </span>
            </CCol>
          </CRow>
        </div>
      </CModalBody>
      <CModalFooter>
        <CButton color="primary" disabled={loading} onClick={handlePrint}>
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
