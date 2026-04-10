import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { cilCamera } from '@coreui/icons'
import { useProductosStore } from '../../stores/useProductosStore'
import { useUIStore } from '../../stores/useUIStore'
import { ModalDetalleProducto } from '../productos/ModalDetalleProducto'
import { ModalEtiqueta } from '../productos/ModalEtiqueta'
import {
  CCardFooter,
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardTitle,
  CCardBody,
  CButton,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

export default function QRScanner() {
  const [qrResult, setQrResult] = useState(null)
  const [scanning, setScanning] = useState(false)
  const scannerRef = useRef(null)
  const { getProducto } = useProductosStore()
  const { openModal } = useUIStore()

  useEffect(() => {
    const startScanner = async () => {
      const html5QrCode = new Html5Qrcode('qr-reader')
      scannerRef.current = html5QrCode

      try {
        const devices = await Html5Qrcode.getCameras()
        const backCamera = devices.find((d) => d.label.toLowerCase().includes('back'))
        const cameraId = backCamera ? backCamera.id : devices[0]?.id

        if (!cameraId) {
          setQrResult('No se encontró cámara disponible.')
          return
        }

        await html5QrCode.start(
          cameraId,
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            setQrResult(decodedText)
            handleOpenModal(decodedText)
            html5QrCode.stop()
            scannerRef.current = null
            setScanning(false)
          },
          (error) => {
            console.warn('No se detectó código QR:', error)
          },
        )
      } catch (err) {
        setQrResult('Error al acceder a la cámara.')
        console.error(err)
      }
    }

    try {
      if (scanning) {
        startScanner()
      } else {
        if (scannerRef.current) {
          scannerRef.current.stop().catch(console.error)
          scannerRef.current.clear().catch(console.error)
          scannerRef.current = null
        }
      }
    } catch (error) {
      console.error('Error al iniciar el escáner:', error)
    }

    return () => {
      try {
        if (scannerRef.current) {
          scannerRef.current.stop().catch(console.error)
          scannerRef.current.clear().catch(console.error)
          scannerRef.current = null
        }
      } catch (error) {
        console.error('Error al limpiar el escáner:', error)
      }
    }
  }, [scanning])

  const handleOpenModal = (code) => {
    getProducto(code)
    openModal(<span>Info Producto</span>, '', '')
  }

  return (
    <>
      <CRow>
        <CCol xs="12">
          <CCard>
            <CCardHeader className="d-flex justify-content-between align-items-center">
              <div className="card-header-actions text-start">
                <CCardTitle>Escáner de Código QR</CCardTitle>
              </div>
              <div className="card-header-actions text-end">
                <CButton
                  color={scanning ? 'secondary' : 'primary'}
                  onClick={() => setScanning(!scanning)}
                >
                  <CIcon icon={cilCamera} /> {scanning ? 'Detener cámara' : 'Escanear con cámara'}
                </CButton>
              </div>
            </CCardHeader>
            <CCardBody className="d-flex justify-content-between align-items-center">
              {qrResult && (
                <p>
                  <strong>Resultado:</strong> {qrResult}
                </p>
              )}
            </CCardBody>
            <CCardFooter className="d-flex justify-content-between align-items-center">
              <div id="qr-reader" style={{ width: '100%' }}></div>
            </CCardFooter>
          </CCard>
        </CCol>
      </CRow>
      <ModalDetalleProducto action={() => {}} />
      <ModalEtiqueta />
    </>
  )
}
