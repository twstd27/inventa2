import { useEffect, useState, useRef } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CCardTitle,
  CInputGroup,
  CInputGroupText,
  CFormInput,
  CButton,
  CCloseButton,
} from '@coreui/react'
import { useProductosStore } from '../../stores/useProductosStore'
import { useCategoriasStore } from '../../stores/useCategoriasStore'
import { useUIStore } from '../../stores/useUIStore'
import { cilQrCode } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { Check, Filter, Printer, RefreshCcw, Search } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { useReactToPrint } from 'react-to-print'
import { useDebounce } from '../../hooks/useDebounde'

const AdministrarEtiquetas = () => {
  const componentRef = useRef(null)
  const { productosEtiqueta: productosCargados, getProductos } = useProductosStore()
  const { getCategorias } = useCategoriasStore()
  const loading = useUIStore((s) => s.loadingCount > 0)
  const [procesando, setProcesando] = useState(false)

  const [state, setState] = useState({
    buscar: '',
    productos: [],
  })

  const { buscar, productos } = state
  const debouncedBuscar = useDebounce(buscar, 300)

  useEffect(() => {
    getProductos('etiquetas')
    getCategorias('combo')
  }, [])

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      productos: productosCargados,
    }))
  }, [productosCargados])

  useEffect(() => {
    if (buscar === '') return

    const filtrar = async () => {
      setProcesando(true)

      await new Promise((res) => setTimeout(res, 0)) // similar a setTimeout

      const palabras = debouncedBuscar
        .split(',')
        .map((p) => p.trim().toLowerCase())
        .filter((p) => p !== '')

      const productosFiltrados = productosCargados.filter((producto) =>
        palabras.some(
          (palabra) =>
            producto.name?.toLowerCase().includes(palabra) ||
            producto.code?.toLowerCase().includes(palabra),
        ),
      )

      setState((prev) => ({
        ...prev,
        productos: productosFiltrados,
      }))

      setProcesando(false)
    }

    filtrar()
  }, [debouncedBuscar])

  const handleStateChange = ({ target }) => {
    setState({
      ...state,
      [target.name]: target.value,
    })
  }

  const eliminarProducto = (index) => {
    setProcesando(true)
    const auxProductos = [...productos]
    auxProductos.splice(index, 1)
    setState((prev) => ({
      ...prev,
      productos: auxProductos,
    }))
    setProcesando(false)
  }

  const restaurarProductos = () => {
    setProcesando(true)
    const auxProductos = [...productosCargados]
    setState((prev) => ({
      ...prev,
      buscar: '',
      productos: auxProductos,
    }))
    setProcesando(false)
  }

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `etiquetas`,
  })

  return (
    <CRow>
      <CCol xs="12">
        <CCard>
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <div className="card-header-actions text-start">
              <CCardTitle>
                <CIcon icon={cilQrCode} size="xl" /> Imprimir Etiquetas
              </CCardTitle>
            </div>
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol md="2">
                <div className="flex-fill d-flex align-items-center justify-content-center">
                  <Filter size={16} /> Filtros
                </div>
              </CCol>
              <CCol md="6">
                <CInputGroup>
                  <CInputGroupText>
                    <Search size={16} />
                  </CInputGroupText>
                  <CFormInput
                    name="buscar"
                    value={buscar}
                    onChange={handleStateChange}
                    placeholder="Nombre o Código de Producto"
                  />
                  <CInputGroupText>
                    {procesando ? (
                      <div
                        className="spinner-border text-primary"
                        role="status"
                        style={{ width: '1rem', height: '1rem' }}
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    ) : (
                      <Check size={16} />
                    )}
                  </CInputGroupText>
                </CInputGroup>
              </CCol>
              <CCol md="2" className="text-center">
                <CButton className="btn btn-primary w-100" type="button" onClick={handlePrint}>
                  <Printer /> Imprimir
                </CButton>
              </CCol>
              <CCol md="2" className="text-center">
                <CButton
                  className="btn btn-primary w-100"
                  type="button"
                  onClick={restaurarProductos}
                >
                  <RefreshCcw /> Mostrar todo
                </CButton>
              </CCol>
              <CCol md="12" className="mt-2" style={{ borderTop: '1px dashed #cecece' }}></CCol>
              <CCol md="12" ref={componentRef} className="p-1 mt-2">
                {loading ? (
                  <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ minHeight: 200 }}
                  >
                    <span className="me-2">Cargando...</span>
                    <div
                      className="spinner-border text-primary"
                      role="status"
                      style={{ width: '2rem', height: '2rem' }}
                    >
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '1rem',
                      opacity: procesando ? 0.5 : 1,
                    }}
                  >
                    {productos.map((producto, index) => (
                      <div
                        key={index}
                        style={{
                          flex: '0 0 calc(33.333% - 1rem)', // máximo 3 por fila
                          boxSizing: 'border-box',
                        }}
                      >
                        <div id="etiqueta2" className="border rounded-3">
                          <CCloseButton
                            className="no-print"
                            style={{ float: 'right' }}
                            onClick={() => eliminarProducto(index)}
                          />
                          <div
                            className="articulo_etiqueta rounded-top-3"
                            style={{
                              backgroundColor: '#cecece',
                              padding: '2px',
                              marginBottom: '5px',
                            }}
                          >
                            <b>
                              {`${producto.code} |` || ''} {producto.name || ''}
                            </b>
                          </div>
                          <div className="d-flex">
                            <div
                              style={{
                                width: '33.33%',
                                display: 'flex',
                                justifyContent: 'center',
                              }}
                            >
                              <QRCodeSVG
                                value={producto.code || 'sin codigo'}
                                className="barcode_etiqueta"
                              />
                            </div>
                            <div
                              style={{
                                width: '66.66%',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                fontWeight: 'bold',
                              }}
                            >
                              <span className="precio_etiqueta" style={{ textAlign: 'right' }}>
                                {producto.price}
                              </span>
                              <span className="moneda_etiqueta"> Bs.</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default AdministrarEtiquetas
