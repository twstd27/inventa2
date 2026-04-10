import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CButton,
  // CDataTable,
  // CInput,
  // CInputGroupPrepend,
  // CInputGroup,
  // CFormGroup,
  // CInputGroupText,
  // CLabel,
  // CInvalidFeedback,
  // CTextarea,
  // CDropdownToggle,
  // CDropdownMenu,
  // CDropdownItem,
  // CDropdownDivider,
  // CDropdown,
  // CTabs,
  // CNav,
  // CNavItem,
  // CNavLink,
  // CTabContent,
  // CTabPane,
  // CLink,
  // CListGroup,
  // CListGroupItem,
  // CTooltip,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { useProductosStore } from '../../stores/useProductosStore'
import { useSucursalesStore } from '../../stores/useSucursalesStore'
import { useAuthStore } from '../../stores/useAuthStore'
import { useUIStore } from '../../stores/useUIStore'
import { useCotizacionesStore } from '../../stores/useCotizacionesStore'
import Select from 'react-select'
import { Dialog } from '../common/Dialog'
import { format, formatDistanceToNow } from 'date-fns'
import { ModalCotizaciones } from './ModalCotizaciones'
import { CardProducto } from '../productos/CardProducto'
import { ModalDetalleProducto } from '../productos/ModalDetalleProducto'
import { DialogCotizaciones } from './DialogCotizaciones'

const Cotizaciones = () => {
  const { usuario } = useAuthStore()
  const { productos, resetProductosLista, setProducto, getProductos } = useProductosStore()
  const { cotizaciones, getCotizaciones, registerQuotation, setCotizacion } = useCotizacionesStore()
  const { sucursalesCombo, getSucursales } = useSucursalesStore()
  const loading = useUIStore((s) => s.loadingCount > 0)
  const { openModal, openDialog, openCotizacionesDialog, openCotizacionesModal, closeModal } = useUIStore()
  const [state, setState] = useState({
    lineas: [],
    doc_date: format(Date.now(), 'YYYY-MM-DD'),
    comments: '',
    customer: '',
    docTotal: '0.00',
    errDocDate: false,
    errBranch: '',
    sucursalVenta: null,
    buscar: '',
    active: 0,
  })

  const {
    doc_date,
    comments,
    customer,
    errDocDate,
    errBranch,
    docTotal,
    sucursalVenta,
    lineas,
    buscar,
    active,
  } = state

  useEffect(() => {
    getSucursales('combo')
    getCotizaciones('lista')
    resetProductosLista()
  }, [])

  const fields = [
    { key: 'product', label: 'Producto', _style: { width: '30%' } },
    { key: 'quantity', label: 'Cantidad', _style: { width: '25%' } },
    { key: 'price', label: 'Precio', _style: { width: '25%' } },
    {
      key: 'total',
      label: 'Subtotal',
      _style: { width: '15%' },
      _classes: 'text-right font-weight-bold',
    },
    {
      key: 'acciones',
      label: '',
      _style: { width: '5%' },
      sorter: false,
      filter: false,
    },
  ]

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

  const handleLineasChange = ({ target }) => {
    const type = target.name.substring(0, 1)
    const position = target.name.substring(1)

    const aux = JSON.parse(JSON.stringify(lineas))
    switch (type) {
      case 'q':
        aux[position].quantity = target.value
        if (target.value === '') {
          aux[position].errorQuantity = true
        } else {
          if (target.value * 1 > target.max * 1) {
            aux[position].errorQuantity = true
          } else {
            aux[position].errorQuantity = target.value * 1 < target.min * 1
          }
        }
        break
      case 'p':
        aux[position].price = target.value
        if (target.value === '0') {
          aux[position].errorPrice = true
        } else {
          aux[position].errorPrice = target.value * 1 < target.min * 1
        }
        break
      default:
        break
    }
    let total = aux[position].quantity * aux[position].price
    aux[position].total = total.toFixed(2) // TODO: parametrizar

    let docTotal = TotalDocumento(aux)
    setState({
      ...state,
      lineas: aux,
      docTotal: docTotal.toFixed(2), // TODO: parametrizar
    })
  }

  const handleClickAdd = (producto) => {
    closeModal()
    if (producto.quantity === '0.00') {
      openDialog(
        <span>
          <i className="fa fa-exclamation-triangle" /> Alerta
        </span>,
        <span>
          No hay suficiente exitencia del producto <b>{producto.name}</b> en la sucursal{' '}
          <b>{sucursalVenta.label}</b>
        </span>,
        '',
        'Cerrar',
        '',
      )
    } else {
      const exists = lineas.findIndex((linea) => linea.product.id === producto.id)
      if (exists === -1) {
        const aux = lineas
        aux.push({
          quantity: 1,
          price: producto.price,
          minPrice: producto.price_wholesome,
          total: producto.price,
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
      } else {
        openDialog(
          <span>
            <i className="fa fa-exclamation-triangle" /> Alerta
          </span>,
          <span>El producto ya esta incluído en la cotización</span>,
          '',
          'Cerrar',
          '',
        )
      }
    }
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

  const Cotizar = () => {
    if (isFormValid()) {
      let result = lineas.find((obj) => {
        return obj.errorQuantity === true || obj.errorPrice === true
      })
      if (!result) {
        setCotizacion({
          branch_id: sucursalVenta.value,
          doc_total: docTotal,
          customer,
          doc_date,
          comments,
          user_id: usuario.id,
          lineas: JSON.stringify(lineas),
        })
        openCotizacionesDialog(
          <span>
            <i className="fa fa-exclamation-triangle" /> Confirmación
          </span>,
          <span>
            esta seguro que quiere realizar la cotización por <b>BOB {docTotal}</b>?
          </span>,
          'Cotizar',
          'Cerrar',
          'crear',
        )
      } else {
        openDialog(
          <span>
            <i className="fa fa-exclamation-triangle" /> Alerta
          </span>,
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
      doc_date: format(Date.now(), 'YYYY-MM-DD'),
      customer: '',
      comments: '',
      docTotal: '0.00',
      errDocDate: false,
      errBranch: '',
      sucursalVenta: null,
    })
  }

  const handleKeyUp = ({ target }) => {
    buscarProducto(target.value, sucursalVenta?.value)
  }

  const buscarProducto = (buscar, sucursal) => {
    if (buscar !== '') {
      if (sucursal !== null && sucursal !== undefined) {
        getProductos('busqueda', { buscar, sucursal })
      }
    }
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

  const openModalCotizacion = (cotizacion) => {
    setCotizacion(cotizacion)
    openCotizacionesModal(<span> Detalle de Cotización</span>, '', '')
  }

  const RealizarCotizacion = (cotizacion) => {
    registerQuotation(cotizacion)
    setState({
      ...state,
      active: 1,
    })
  }

  const RefreshCotizaciones = () => {
    getCotizaciones('lista')
  }

  return (
    <CRow>
      <CCol xs="6" className="d-print-none">
        <CCard>
          <CCardBody>
            {/* Legacy component - kept as-is */}
          </CCardBody>
        </CCard>
      </CCol>
      <Dialog />
      <DialogCotizaciones f1={RealizarCotizacion} />
      <ModalDetalleProducto action={handleClickAdd} />
      <ModalCotizaciones f1={null} />
    </CRow>
  )
}

export default Cotizaciones
