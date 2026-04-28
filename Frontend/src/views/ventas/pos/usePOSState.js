import React, { useEffect, useState, useRef, useCallback } from 'react'
import { CToast, CToastBody } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSave } from '@coreui/icons'
import { TriangleAlert } from 'lucide-react'
import { format } from 'date-fns'
import { useProductosStore } from '../../../stores/useProductosStore'
import { useSucursalesStore } from '../../../stores/useSucursalesStore'
import { useAuthStore } from '../../../stores/useAuthStore'
import { useUIStore } from '../../../stores/useUIStore'
import { useLayoutStore } from '../../../stores/useLayoutStore'
import { useVentasStore } from '../../../stores/useVentasStore'
import { useParamsStore } from '../../../stores/useParamsStore'
import { SelectStyles, roundPrice } from '../../../helpers/global'

const initialState = {
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
  tipo_pago: 'EFECTIVO',
  buscarPage: 1,
}

export const usePOSState = () => {
  const { productos, loadingMore, resetProductosLista, setProducto, getProductos } = useProductosStore()
  const { usuario } = useAuthStore()
  const { sucursalesCombo, getSucursales } = useSucursalesStore()
  const loading = useUIStore((s) => s.loadingCount > 0)
  const { openModal, openDialog, openVentasDialog, closeModal } = useUIStore()
  const { theme } = useLayoutStore()
  const { registerSale } = useVentasStore()
  const { getParams } = useParamsStore()

  const [toast, addToast] = useState()
  const [params, setParams] = useState([])
  const toaster = useRef(null)
  const debounceTimer = useRef(null)

  const selectStyles = SelectStyles(theme)

  const [state, setState] = useState(initialState)

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
    tipo_pago,
    buscarPage,
  } = state

  useEffect(() => {
    getSucursales('combo')
    resetProductosLista()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

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
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const TotalDocumento = (lineas) => {
    return lineas.reduce((acc, linea) => acc + linea.total * 1, 0)
  }

  const handleStateChange = useCallback(({ target }) => {
    setState((prev) => ({ ...prev, [target.name]: target.value }))
  }, [])

  const handleSelectChangeBranch = useCallback((values) => {
    setState((prev) => ({ ...prev, sucursalVenta: values }))
    buscarProducto(buscar, values.value)
  }, [buscar]) // eslint-disable-line react-hooks/exhaustive-deps

  const redondeo = Number(params.find((p) => p.name === 'RedondeoPrecios')?.value ?? 0)

  // Determina si está activo el control de stock para la sucursal seleccionada.
  // Cascada: sucursal.venta_sin_stock !== null → usa sucursal; si null → usa params[2]
  const stockControlActivo = () => {
    if (sucursalVenta?.venta_sin_stock !== null && sucursalVenta?.venta_sin_stock !== undefined) {
      return !sucursalVenta.venta_sin_stock
    }
    return params[2]?.value === '0'
  }

  const handleLineasChangeCantidad = ({ target }) => {
    const isQuantityInvalid = stockControlActivo()
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

    const total = auxLineas[position].quantity * auxLineas[position].price
    auxLineas[position].total = total.toFixed(2)

    setState((prev) => ({
      ...prev,
      lineas: auxLineas,
      docTotal: TotalDocumento(auxLineas).toFixed(2),
    }))
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

    const total = auxLineas[position].quantity * auxLineas[position].price
    auxLineas[position].total = total.toFixed(2)

    setState((prev) => ({
      ...prev,
      lineas: auxLineas,
      docTotal: TotalDocumento(auxLineas).toFixed(2),
    }))
  }

  const handleClickAdd = useCallback((producto) => {
    closeModal()

    const isQuantityInvalid = producto.quantity <= 0 && stockControlActivo()
    const productExists = lineas.findIndex((linea) => linea.product.id === producto.id) !== -1

    if (isQuantityInvalid) {
      openDialog(
        <>
          <TriangleAlert /> Cantidad Insuficiente
        </>,
        <span>
          No hay suficiente existencia del producto <b>{producto.name}</b> en la sucursal{' '}
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
        <span>El producto ya está incluído en la venta</span>,
        '',
        'Cerrar',
        '',
      )
      return
    }

    const precioRedondeado = roundPrice(Number(producto.price) || 0, redondeo)

    const aux = [
      ...lineas,
      {
        quantity: 1,
        price: precioRedondeado,
        cost: producto.cost,
        total: precioRedondeado,
        priceList: 1,
        minPrice: producto.price_wholesome,
        maxQuantity: producto.quantity,
        product: { id: producto.id, code: producto.code, name: producto.name },
        errorQuantity: false,
        errorPrice: false,
      },
    ]

    setState((prev) => ({
      ...prev,
      lineas: aux,
      docTotal: TotalDocumento(aux).toFixed(2),
    }))
  }, [lineas, params, sucursalVenta]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleClickRemove = useCallback((x) => {
    const aux = lineas.filter((_, i) => i !== x)
    setState((prev) => ({
      ...prev,
      lineas: aux,
      docTotal: TotalDocumento(aux).toFixed(2),
    }))
  }, [lineas]) // eslint-disable-line react-hooks/exhaustive-deps

  const isFormValid = () => {
    let valid = true
    let invalid = { branch: '', doc_date: false }

    if (doc_date.trim().length === 0) {
      invalid.doc_date = true
      valid = false
    }
    if (sucursalVenta === null || sucursalVenta === undefined || sucursalVenta.length === 0) {
      invalid.branch = 'este campo no puede estar vacío'
      valid = false
    }

    setState((prev) => ({ ...prev, errBranch: invalid.branch, errDocDate: invalid.doc_date }))
    return valid
  }

  const Vender = () => {
    if (!isFormValid()) return

    const result = lineas.find((obj) => obj.errorQuantity === true || obj.errorPrice === true)
    if (result) {
      openDialog(
        <>
          <TriangleAlert /> Alerta
        </>,
        <span>Hay errores en las líneas de detalle, solucionelos antes de continuar..</span>,
        '',
        'Cerrar',
        '',
      )
      return
    }

    const nuevaVenta = {
      branch_id: sucursalVenta.value,
      doc_total: docTotal,
      doc_date,
      comments,
      invoice,
      invoice_number,
      customer,
      customer_number,
      tipo_pago,
      user_id: usuario.id,
      lineas: JSON.stringify(lineas),
    }

    openVentasDialog(
      <>
        <TriangleAlert /> Confirmar Venta
      </>,
      <span>
        está seguro que quiere realizar la venta por <b>BOB {docTotal}</b>?
      </span>,
      'Vender',
      'Cerrar',
      'crear',
      nuevaVenta,
    )
  }

  const resetForm = () => {
    setState({ ...initialState, doc_date: format(Date.now(), 'yyyy-MM-dd') })
  }

  const buscarProducto = (buscar, sucursal) => {
    if (buscar !== '' && sucursal != null) {
      setState((prev) => ({ ...prev, buscarPage: 1 }))
      getProductos('busqueda', { buscar, sucursal }, 1)
    }
  }

  const handleScrollEnd = useCallback(() => {
    const { paginaActual, ultimaPagina } = useProductosStore.getState()
    if (paginaActual >= ultimaPagina) return
    const nextPage = paginaActual + 1
    getProductos('busqueda-append', { buscar, sucursal: sucursalVenta?.value }, nextPage)
  }, [buscar, sucursalVenta, getProductos]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleKeyUp = ({ target }) => {
    clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(() => {
      buscarProducto(target.value, sucursalVenta?.value)
    }, 500)
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

  const showToast = (color, message) => (
    <CToast color={color}>
      <CToastBody>
        <CIcon icon={cilSave} /> {message}
      </CToastBody>
    </CToast>
  )

  const RealizarVenta = (venta) => {
    registerSale(venta)
    addToast(showToast('success', 'Venta registrada'))
    setState({ ...initialState, doc_date: format(Date.now(), 'yyyy-MM-dd'), active: 1 })
  }

  return {
    // state
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
    invoice_number,
    customer,
    customer_number,
    tipo_pago,
    stockControlActivo: stockControlActivo(),
    params,
    redondeo,
    // derived
    loading,
    loadingMore,
    productos,
    sucursalesCombo,
    selectStyles,
    toast,
    toaster,
    // handlers
    handleStateChange,
    handleSelectChangeBranch,
    handleLineasChangeCantidad,
    handleLineasChangePrecio,
    handleClickAdd,
    handleClickRemove,
    handleScrollEnd,
    Vender,
    resetForm,
    handleKeyUp,
    openModalProducto,
    TotalDocumento,
    RealizarVenta,
  }
}
