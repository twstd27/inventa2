import React, { useEffect, useState, useRef } from 'react'
import {
  CCard,
  CCardBody,
  CCardFooter,
  CCol,
  CRow,
  CButton,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CFormTextarea,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CDropdownDivider,
  CDropdown,
  CTooltip,
  CFormSelect,
  CButtonGroup,
  CToast,
  CToastBody,
  CToaster,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSave } from '@coreui/icons'
import { useProductosStore } from '../../stores/useProductosStore'
import { useCategoriasStore } from '../../stores/useCategoriasStore'
import { useSucursalesStore } from '../../stores/useSucursalesStore'
import { useAuthStore } from '../../stores/useAuthStore'
import { useUIStore } from '../../stores/useUIStore'
import { useLayoutStore } from '../../stores/useLayoutStore'
import { useVentasStore } from '../../stores/useVentasStore'
import { useParamsStore } from '../../stores/useParamsStore'
import Select from 'react-select'
import { Dialog } from '../common/Dialog'
import { format } from 'date-fns'
import { DialogVentas } from './DialogVentas'
import { ModalVentas } from './ModalVentas'
import { CardProducto } from '../productos/CardProducto'
import { ModalCotizaciones } from './ModalCotizaciones'
import { ModalDetalleProducto } from '../productos/ModalDetalleProducto'
import { ModalEtiqueta } from '../productos/ModalEtiqueta'
import { DialogCotizaciones } from './DialogCotizaciones'
import { SelectStyles } from '../../helpers/global'
import {
  ReceiptText,
  TriangleAlert,
  Trash,
  Search,
  EllipsisVertical,
  Filter,
  X,
  Warehouse,
  ShoppingCart,
  File,
} from 'lucide-react'

const POS = () => {
  const { productos, resetProductosLista, setProducto, getProductos } = useProductosStore()
  const { usuario } = useAuthStore()
  const { sucursalesCombo, getSucursales } = useSucursalesStore()
  const loading = useUIStore((s) => s.loadingCount > 0)
  const { openModal, openDialog, openVentasDialog, closeModal } = useUIStore()
  const { theme } = useLayoutStore()
  const { registerSale, setVenta } = useVentasStore()
  const { getParams } = useParamsStore()

  const [toast, addToast] = useState()
  const [params, setParams] = useState([])
  const toaster = useRef(null)

  const selectStyles = SelectStyles(theme)
  const debounceTimer = useRef(null)

  const [state, setState] = useState({
    lineas: [],
    doc_date: format(Date.now(), 'yyyy-MM-dd'),
    comments: '',
    docTotal: 0,
    errDocDate: false,
    errBranch: '',
    sucursalVenta: null,
    buscar: '',
    active: 1,
    invoice: false,
    invoice_number: '',
    customer: '',
    customer_number: '',
  })

  const {
    doc_date,
    comments,
    errDocDate,
    errBranch,
    docTotal,
    sucursalVenta,
    lineas,
    buscar,
    active,
    invoice,
    customer,
    invoice_number,
    customer_number,
  } = state

  useEffect(() => {
    getSucursales('combo')
    // getVentas('', 1, 10)
    // getCotizaciones('lista')
    resetProductosLista()
    // getCategorias('combo')
  }, [])

  useEffect(() => {
    const fetchParams = async () => {
      try {
        const data = await getParams()
        setParams(data)
      } catch (error) {
        console.error('Error fetching params:', error)
      }
    }

    fetchParams()
  }, [])

  const handleStateChange = ({ target }) => {
    setState({
      ...state,
      [target.name]: target.value,
    })
  }

  const handleSelectChangeBranch = (values) => {
    setState({
      ...state,
      sucursalVenta: values,
    })
    buscarProducto(buscar, values.value)
  }

  const handleLineasChangeCantidad = ({ target }) => {
    const isQuantityInvalid = params[2]?.value === '0'

    const auxLineas = [...lineas]
    const position = target.name.substring(1)

    auxLineas[position].quantity = target.value

    if (isQuantityInvalid) {
      if (target.value < 0) {
        auxLineas[position].errorQuantity = true
        return
      } else {
        auxLineas[position].errorQuantity = target.value * 1 > target.max * 1 || target.value == 0
      }
    }

    let total = auxLineas[position].quantity * auxLineas[position].price
    auxLineas[position].total = total.toFixed(2) // TODO: parametrizar

    let docTotal = TotalDocumento(auxLineas)

    setState({
      ...state,
      lineas: auxLineas,
      docTotal: docTotal.toFixed(2), // TODO: parametrizar
    })
  }

  const handleLineasChangePrecio = ({ target }) => {
    const auxLineas = [...lineas]
    const position = target.name.substring(1)

    auxLineas[position].price = target.value
    auxLineas[position].errorPrice = target.value * 1 < target.min * 1
    if (target.value === '0') {
      auxLineas[position].errorPrice = true
      return
    }

    let total = auxLineas[position].quantity * auxLineas[position].price
    auxLineas[position].total = total.toFixed(2) // TODO: parametrizar

    let docTotal = TotalDocumento(auxLineas)

    setState({
      ...state,
      lineas: auxLineas,
      docTotal: docTotal.toFixed(2), // TODO: parametrizar
    })
  }

  const handleClickAdd = (producto) => {
    closeModal()

    const isQuantityInvalid = producto.quantity <= 0 && params[2]?.value === '0'
    const productExists = lineas.findIndex((linea) => linea.product.id === producto.id) !== -1

    if (isQuantityInvalid) {
      openDialog(
        <>
          <TriangleAlert /> Cantidad Insuficiente
        </>,
        <span>
          No hay suficiente exitencia del producto <b>{producto.name}</b> en la sucursal{' '}
          <b>{sucursalVenta.label}</b>
        </span>,
        '',
        'Cerrar',
        '',
      )
      return
    }

    if (productExists) {
      openDialog(
        <>
          <TriangleAlert /> Producto duplicado
        </>,
        <span>El producto ya esta incluído en la venta</span>,
        '',
        'Cerrar',
        '',
      )
      return
    }

    const aux = [...lineas]
    aux.push({
      quantity: 1,
      price: producto.price,
      cost: producto.cost,
      total: producto.price,
      priceList: 1,
      minPrice: producto.price_wholesome,
      maxQuantity: producto.quantity,
      product: {
        id: producto.id,
        code: producto.code,
        name: producto.name,
      },
      errorQuantity: false,
      errorPrice: false,
    })
    const total = TotalDocumento(aux)
    setState({
      ...state,
      lineas: aux,
      docTotal: total.toFixed(2), // TODO: parametrizar
    })
  }

  const handleClickRemove = (x) => {
    const aux = lineas.filter((img, i) => i !== x)
    const total = TotalDocumento(aux)
    setState({
      ...state,
      lineas: aux,
      docTotal: total.toFixed(2), // TODO: parametrizar
    })
  }

  const isFormValid = () => {
    let valid = true
    let invalid = {
      branch: '',
      doc_date: false,
    }

    if (doc_date.trim().length === 0) {
      invalid.doc_date = true
      valid = false
    }
    if (sucursalVenta === null || sucursalVenta === undefined) {
      invalid.branch = 'este campo no puede estar vacío'
      valid = false
    } else {
      if (sucursalVenta.length === 0) {
        invalid.branch = 'este campo no puede estar vacío'
        valid = false
      }
    }

    setState({
      ...state,
      errBranch: invalid.branch,
      errDocDate: invalid.doc_date,
    })

    return valid
  }

  const Vender = () => {
    if (isFormValid()) {
      let result = lineas.find((obj) => {
        return obj.errorQuantity === true || obj.errorPrice === true
      })
      if (!result) {
        const nuevaVenta = {
          branch_id: sucursalVenta.value,
          doc_total: docTotal,
          doc_date,
          comments,
          invoice,
          invoice_number,
          customer,
          customer_number,
          user_id: usuario.id,
          lineas: JSON.stringify(lineas),
        }

        openVentasDialog(
          <>
            <TriangleAlert /> Confirmar Venta
          </>,
          <span>
            esta seguro que quiere realizar la venta por <b>BOB {docTotal}</b>?
          </span>,
          'Vender',
          'Cerrar',
          'crear',
          nuevaVenta,
        )
      } else {
        openDialog(
          <>
            <TriangleAlert /> Alerta
          </>,
          <span>Hay errores en las líneas de detalle, solucionelos antes de continuar..</span>,
          '',
          'Cerrar',
          '',
        )
      }
    }
  }

  const resetForm = () => {
    setState({
      ...state,
      lineas: [],
      doc_date: format(Date.now(), 'yyyy-MM-dd'),
      comments: '',
      docTotal: 0,
      errDocDate: false,
      errBranch: '',
      sucursalVenta: null,
      invoice: false,
      invoice_number: '',
      customer: '',
      customer_number: '',
      buscar: '',
    })
  }

  const buscarProducto = (buscar, sucursal) => {
    if (buscar !== '') {
      if (sucursal !== null && sucursal !== undefined) {
        getProductos('busqueda', { buscar, sucursal })
      }
    }
  }

  const handleKeyUp = ({ target }) => {
    clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(() => {
      buscarProducto(target.value, sucursalVenta?.value)
    }, 500)
  }

  const TotalDocumento = (lineas) => {
    let total = 0
    lineas.forEach((linea) => {
      total += linea.total * 1
    })
    return total
  }

  const openModalProducto = (producto) => {
    setProducto(producto)
    openModal(
      <span>
        {producto.code} - {producto.name}
      </span>,
      'Agregar',
      '',
    )
  }

  // const openVentaModal = (venta) => {
  //   setVenta(venta)
  //   openVentasModal(<span> Detalle de Venta</span>, '', 'crear')
  // }

  // const openModalCotizacion = (cotizacion) => {
  //   setCotizacion(cotizacion)
  //   openCotizacionesModal(<span> Detalle de Cotización</span>, '', '')
  // }

  const RealizarVenta = (venta) => {
    registerSale(venta)
    setState({
      ...state,
      active: 1,
    })

    addToast(showToast('success', 'Venta registrada'))
    setState({
      ...state,
      lineas: [],
      doc_date: format(Date.now(), 'yyyy-MM-dd'),
      comments: '',
      docTotal: 0,
      errDocDate: false,
      errBranch: '',
      invoice: false,
      invoice_number: '',
      customer: '',
      customer_number: '',
    })
  }

  // const Cotizar = () => { ... }
  // const RealizarCotizacion = (cotizacion) => { ... }
  // const CopiarCotizacion = (cotizacion) => { ... }
  // const RefreshVentas = () => { ... }
  // const RefreshCotizaciones = () => { ... }

  const showToast = (color, message) => (
    <CToast color={color}>
      <CToastBody>
        <CIcon icon={cilSave} /> {message}
      </CToastBody>
    </CToast>
  )

  return (
    <>
      <CToaster className="p-3" placement="bottom-end" push={toast} ref={toaster} />
      <CRow>
        <CCol xs="12">
          <CCard className="p-0">
            {/* <CCardHeader className="bg-primary text-white">
            <CRow>
              <CCol xs="12" className="text-2xl">
                <Calculator size={20} /> Punto de Venta
              </CCol>
            </CRow>
          </CCardHeader> */}
            <CCardBody>
              <CRow>
                <CCol lg="6" xl="8">
                  <CRow>
                    <CCol xs="6">
                      <Select
                        value={sucursalVenta}
                        onChange={handleSelectChangeBranch}
                        options={sucursalesCombo}
                        isDisabled={lineas.length > 0}
                        placeholder="Seleccione una sucursal..."
                        name="branch"
                        styles={selectStyles}
                        className="w-100"
                      />
                      <span className="text-danger small">{errBranch}</span>
                    </CCol>
                    <CCol xs="6">
                      <CInputGroup>
                        <CInputGroupText>
                          <Search size={16} />
                        </CInputGroupText>
                        <CFormInput
                          name="buscar"
                          value={buscar}
                          onChange={handleStateChange}
                          onKeyUp={handleKeyUp}
                          placeholder="Nombre o Código de Producto"
                        />
                      </CInputGroup>
                    </CCol>
                    {/* <CCol xs="2">
                      <CButton
                        color="primary"
                        shape="square"
                        size="sm"
                        variant="ghost"
                        className="m-1"
                      >
                        <Filter size={16} />
                      </CButton>
                    </CCol> */}
                    {/* <CCol xs="12" className="mt-2">
                    <b>Categorias</b>
                  </CCol>
                  <CCol xs="12" style={{ overflowX: 'auto', whiteSpace: 'nowrap', height: '70px' }}>
                    {categoriasCombo !== undefined &&
                      categoriasCombo.map((item, x) => (
                        <CButton key={x} color="primary" shape="square" size="sm" className="m-1">
                          <span className="text-white">{item.label}</span>
                        </CButton>
                      ))}
                  </CCol> */}
                    <CCol xs="12" className="mt-2" style={{ height: '650px', overflow: 'auto' }}>
                      {sucursalVenta === null ? (
                        <span className="text-danger small">debe elegir una sucursal</span>
                      ) : (
                        <span className="text-primary small">
                          Buscando productos en sucursal: <b>{sucursalVenta.label}</b>
                        </span>
                      )}
                      {loading ? (
                        <span>
                          <i className="fa fa-spinner fa-spin" /> buscando..
                        </span>
                      ) : productos.length === 0 ? (
                        <h6>No se encontraron resultados</h6>
                      ) : (
                        <CRow>
                          {productos.map((item, x) => (
                            <CardProducto
                              producto={item}
                              agregar={() => {
                                handleClickAdd(item)
                              }}
                              modal={() => {
                                openModalProducto(item)
                              }}
                              key={x}
                            />
                          ))}
                        </CRow>
                      )}
                    </CCol>
                  </CRow>
                </CCol>
                <CCol lg="6" xl="4">
                  <CCard className="p-0" style={{ height: '700px', position: 'relative' }}>
                    <CCardBody className="d-flex flex-column">
                      <CRow>
                        <CCol xs="12" className="d-flex justify-content-between align-items-center">
                          <div className="card-header-actions text-start">
                            <span>
                              <b>Detalle de venta</b>{' '}
                              <CTooltip content="Venta Con Factura" placement="top">
                                <ReceiptText
                                  size={24}
                                  className={`${invoice ? 'text-primary' : 'display-none'}`}
                                />
                              </CTooltip>
                            </span>
                          </div>
                          <div className="card-header-actions text-end">
                            <CDropdown variant="btn-group">
                              <CDropdownToggle color="primary" caret>
                                <EllipsisVertical size={16} />
                              </CDropdownToggle>
                              <CDropdownMenu>
                                <CDropdownItem
                                  onClick={resetForm}
                                  className="text-danger cursor-pointer"
                                >
                                  <X size={16} /> Borrar Formulario
                                </CDropdownItem>
                              </CDropdownMenu>
                            </CDropdown>
                          </div>
                        </CCol>
                        <CCol xs="12">
                          <CFormInput
                            type="date"
                            name="doc_date"
                            plainText
                            value={doc_date || ''}
                            onChange={handleStateChange}
                            invalid={errDocDate}
                            feedbackInvalid="este campo no puede estar vacío"
                          />
                        </CCol>
                        <CCol
                          xs="12"
                          className="mt-2"
                          style={{ height: '400px', overflow: 'auto' }}
                        >
                          {lineas.map((item, x) => (
                            <CCard
                              className="mb-2"
                              style={{ borderLeft: 'none', borderRight: 'none', borderTop: 'none' }}
                              key={x}
                            >
                              <CRow className="g-0">
                                <CCol md={11}>
                                  <span className="d-flex vertical-align-middle small">
                                    {item.product.code + ' - ' + item.product.name}
                                  </span>
                                </CCol>
                                <CCol md={1} className="text-center">
                                  <CButton
                                    size="sm"
                                    color="danger"
                                    variant="ghost"
                                    onClick={() => handleClickRemove(x)}
                                  >
                                    <Trash size={16} />
                                  </CButton>
                                </CCol>
                                <CCol md={12}>
                                  <CRow className="g-0">
                                    <CCol
                                      md={12}
                                      className="d-flex justify-content-around align-items-center mb-1"
                                    >
                                      <CInputGroup className="m-1">
                                        <CInputGroupText as="label" htmlFor={`q${x}`}>
                                          <ShoppingCart size={16} />
                                        </CInputGroupText>
                                        <CFormInput
                                          size="sm"
                                          className="text-right"
                                          style={{ height: '38px' }}
                                          type="number"
                                          name={`q${x}`}
                                          min={0}
                                          max={
                                            params[2]?.value === '0' ? item.maxQuantity : undefined
                                          }
                                          value={item.quantity}
                                          invalid={item.errorQuantity}
                                          valid={!item.errorQuantity}
                                          onChange={handleLineasChangeCantidad}
                                        />
                                      </CInputGroup>
                                      {/* <CFormSelect
                                      name={`l${x}`}
                                      value={params[1]?.value}
                                      options={preciosCombo}
                                      className="m-1 w-50"
                                      onChange={handleLineasChangePriceList}
                                    ></CFormSelect> */}
                                      <CInputGroup className="m-1">
                                        <CInputGroupText as="label" htmlFor={`p${x}`}>
                                          Bs
                                        </CInputGroupText>
                                        <CFormInput
                                          size="sm"
                                          className="text-right"
                                          type="number"
                                          name={`p${x}`}
                                          min={item.minPrice}
                                          value={item.price}
                                          invalid={item.errorPrice}
                                          valid={!item.errorPrice}
                                          onChange={handleLineasChangePrecio}
                                        />
                                      </CInputGroup>
                                    </CCol>
                                  </CRow>
                                </CCol>
                                <CCol md={12}>
                                  <span className="d-flex justify-content-end small text-danger">
                                    {item.errorPrice &&
                                      `(El precio debe ser mayor a ${item.minPrice})`}
                                    {item.errorQuantity && `(Cantidad incorrecta)`}
                                  </span>
                                </CCol>
                              </CRow>
                            </CCard>
                          ))}
                        </CCol>
                      </CRow>

                      {/* Elementos fijos al fondo */}
                      <div className="mt-auto">
                        <CCol xs="12" className="mt-2">
                          <CCard className="p-0">
                            <CCardBody>
                              <CRow>
                                {/* <CCol xs="12">
                                <CFormTextarea
                                  value={comments}
                                  placeholder="Comentarios"
                                  onChange={handleStateChange}
                                  name="comments"
                                  rows="1"
                                />
                              </CCol> */}
                                <CCol
                                  xs="12"
                                  className="d-flex justify-content-between align-items-center"
                                >
                                  Total a Pagar:{' '}
                                  <span>
                                    Bs{' '}
                                    <span className="text-2xl">
                                      <b>{TotalDocumento(lineas).toFixed(2)}</b>{' '}
                                    </span>
                                  </span>
                                </CCol>
                              </CRow>
                            </CCardBody>
                          </CCard>
                        </CCol>
                        <CCol xs="12" className="mt-2">
                          <div className="d-grid gap-2">
                            <CButtonGroup
                              role="group"
                              aria-label="Button group with nested dropdown"
                            >
                              <CButton
                                color="primary"
                                size="lg"
                                disabled={lineas.length === 0}
                                onClick={Vender}
                              >
                                Realizar Venta
                              </CButton>
                              <CDropdown variant="btn-group">
                                <CDropdownToggle color="primary"> </CDropdownToggle>
                                <CDropdownMenu>
                                  <CDropdownItem href="#" className="text-info">
                                    <File size={16} /> Realizar Cotización
                                  </CDropdownItem>
                                </CDropdownMenu>
                              </CDropdown>
                            </CButtonGroup>
                          </div>
                        </CCol>
                      </div>
                    </CCardBody>
                  </CCard>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
        <Dialog />
        <ModalDetalleProducto action={handleClickAdd} />
        <ModalEtiqueta />
        <DialogVentas f1={RealizarVenta} />
        {/* <DialogCotizaciones f1={RealizarCotizacion} /> */}
        <ModalVentas />
        {/* <ModalCotizaciones f1={CopiarCotizacion} /> */}
      </CRow>
    </>
  )
}

export default POS
