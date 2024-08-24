import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CButton,
  // CDataTable,
  CFormInput,
  // CInputGroupPrepend,
  CInputGroup,
  // CFormGroup,
  CInputGroupText,
  CFormLabel,
  // CInvalidFeedback,
  CFormTextarea,
  CListGroupItem,
  CListGroup,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CDropdownDivider,
  CDropdown,
  CTooltip,
  CTabs,
  CTab,
  CTabList,
  CNavItem,
  CNavLink,
  CNav,
  CTabContent,
  CTabPane,
  CFormSwitch,
  CTabPanel,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { useDispatch, useSelector } from 'react-redux'
import { getProductos, resetProductosLista, setProducto } from '../../actions/productosAction'
import Select from 'react-select'
import { getSucursales } from '../../actions/sucursalesAction'
import { Dialog } from '../common/Dialog'
import {
  uiCloseModal,
  uiOpenCotizacionesDialog,
  uiOpenCotizacionesModal,
  uiOpenDialog,
  uiOpenModal,
  uiOpenVentasDialog,
  uiOpenVentasModal,
} from '../../actions/uiAction'
import { getVentas, registerSale, setVenta } from '../../actions/ventasAction'
import { format, formatDistanceToNow, parseISO } from 'date-fns'
// import moment from 'moment'
import { DialogVentas } from './DialogVentas'
import { ModalVentas } from './ModalVentas'
import { getCotizaciones, registerQuotation, setCotizacion } from '../../actions/cotizacionesAction'
import { CardProducto } from '../productos/CardProducto'
import { ModalCotizaciones } from './ModalCotizaciones'
import { ModalDetalleProducto } from '../productos/ModalDetalleProducto'
import { DialogCotizaciones } from './DialogCotizaciones'

import { useReactTable, flexRender, getCoreRowModel } from '@tanstack/react-table'

const POS = () => {
  const { productos } = useSelector((state) => state.productos)
  const { usuario } = useSelector((state) => state.auth)
  const { ventas } = useSelector((state) => state.ventas)
  const { cotizaciones } = useSelector((state) => state.cotizaciones)
  const { sucursalesCombo } = useSelector((state) => state.sucursales)
  const { loading } = useSelector((state) => state.ui)
  const dispatch = useDispatch()
  const [state, setState] = useState({
    lineas: [],
    doc_date: format(Date.now(), 'yyyy-MM-dd'),
    comments: '',
    docTotal: 0,
    errDocDate: false,
    errBranch: '',
    sucursalVenta: null,
    buscar: '',
    active: 0,
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
    dispatch(getSucursales('combo'))
    dispatch(getVentas('lista'))
    dispatch(getCotizaciones('lista'))
    dispatch(resetProductosLista())
  }, [dispatch])

  // const fields = [
  //   { key: 'product', label: 'Producto', _style: { width: '30%' } },
  //   { key: 'quantity', label: 'Cantidad', _style: { width: '25%' } },
  //   { key: 'price', label: 'Precio', _style: { width: '25%' } },
  //   {
  //     key: 'total',
  //     label: 'Subtotal',
  //     _style: { width: '15%' },
  //     _classes: 'text-right font-weight-bold',
  //   },
  //   {
  //     key: 'acciones',
  //     label: '',
  //     _style: { width: '5%' },
  //     sorter: false,
  //     filter: false,
  //   },
  // ]

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
    dispatch(uiCloseModal())
    if (producto.quantity === '0.00') {
      dispatch(
        uiOpenDialog(
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
        ),
      )
    } else {
      const exists = lineas.findIndex((linea) => linea.product.id === producto.id)
      if (exists === -1) {
        const aux = lineas
        aux.push({
          quantity: 1,
          price: producto.price,
          cost: producto.cost,
          total: producto.price,
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
      } else {
        dispatch(
          uiOpenDialog(
            <span>
              <i className="fa fa-exclamation-triangle" /> Alerta
            </span>,
            <span>El producto ya esta incluído en la venta</span>,
            '',
            'Cerrar',
            '',
          ),
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

  const columns = React.useMemo(
    () => [
      {
        accessorKey: 'product',
        header: 'Producto',
        cell: ({ row }) => <td>{row.original.product.code + ' - ' + row.original.product.name}</td>,
      },
      {
        accessorKey: 'quantity',
        header: 'Cantidad',
        cell: ({ row, getValue }) => (
          <td>
            <CFormInput
              type="number"
              size="sm"
              max={row.original.maxQuantity}
              min={1}
              name={`q${row.index}`}
              value={getValue()}
              invalid={row.original.errorQuantity}
              valid={!row.original.errorQuantity}
              onChange={handleLineasChange}
              feedbackInvalid={`La cantidad debe estar entre 1 y ${row.original.maxQuantity}`}
            />
          </td>
        ),
      },
      {
        accessorKey: 'price',
        header: 'Precio',
        cell: ({ row, getValue }) => (
          <td>
            <CFormInput
              className="text-right"
              type="number"
              size="sm"
              min={row.original.minPrice}
              name={`p${row.index}`}
              value={getValue()}
              invalid={row.original.errorPrice}
              valid={!row.original.errorPrice}
              onChange={handleLineasChange}
              feedbackInvalid={`El precio debe ser mayor a ${row.original.minPrice}`}
            />
          </td>
        ),
      },
      {
        header: 'Acciones',
        cell: ({ row }) => (
          <td>
            <CButton
              color="danger"
              variant="outline"
              shape="square"
              size="sm"
              className="btn-icon"
              onClick={() => handleClickRemove(row.index)}
            >
              <i className="fa fa-trash font-lg" />
            </CButton>
          </td>
        ),
      },
    ],
    [handleLineasChange, handleClickRemove],
  )

  // Usar el hook `useTable`
  const table = useReactTable({
    data: lineas,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

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
        dispatch(
          uiOpenVentasDialog(
            <span>
              <i className="fa fa-exclamation-triangle" /> Confirmación
            </span>,
            <span>
              esta seguro que quiere realizar la venta por <b>BOB {docTotal}</b>?
            </span>,
            'Vender',
            'Cerrar',
            'crear',
          ),
        )
        dispatch(
          setVenta({
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
          }),
        )
      } else {
        dispatch(
          uiOpenDialog(
            <span>
              <i className="fa fa-exclamation-triangle" /> Alerta
            </span>,
            <span>Hay errores en las líneas de detalle, solucionelos antes de continuar..</span>,
            '',
            'Cerrar',
            '',
          ),
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
    })
  }

  const handleKeyUp = ({ target }) => {
    buscarProducto(target.value, sucursalVenta?.value)
  }

  const buscarProducto = (buscar, sucursal) => {
    if (buscar !== '') {
      if (sucursal !== null && sucursal !== undefined) {
        dispatch(getProductos('busqueda', { buscar, sucursal }))
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

  const openModal = (producto) => {
    dispatch(setProducto(producto))
    dispatch(
      uiOpenModal(
        <span>
          {producto.code} - {producto.name}
        </span>,
        'Agregar',
        '',
      ),
    )
  }

  const openVentaModal = (venta) => {
    dispatch(setVenta(venta))
    dispatch(uiOpenVentasModal(<span> Detalle de Venta</span>, '', 'crear'))
  }

  const openModalCotizacion = (cotizacion) => {
    dispatch(setCotizacion(cotizacion))
    dispatch(uiOpenCotizacionesModal(<span> Detalle de Cotización</span>, '', ''))
  }

  const RealizarVenta = (venta) => {
    dispatch(registerSale(venta))
    setState({
      ...state,
      active: 1,
    })
  }

  const Cotizar = () => {
    if (isFormValid()) {
      let result = lineas.find((obj) => {
        return obj.errorQuantity === true || obj.errorPrice === true
      })
      if (!result) {
        dispatch(
          setCotizacion({
            branch_id: sucursalVenta.value,
            doc_total: docTotal,
            customer: '',
            doc_date,
            comments,
            user_id: usuario.id,
            lineas: JSON.stringify(lineas),
          }),
        )
        dispatch(
          uiOpenCotizacionesDialog(
            <span>
              <i className="fa fa-exclamation-triangle" /> Confirmación
            </span>,
            <span>
              esta seguro que quiere realizar la cotización por <b>BOB {docTotal}</b>?
            </span>,
            'Cotizar',
            'Cerrar',
            'crear',
          ),
        )
      } else {
        dispatch(
          uiOpenDialog(
            <span>
              <i className="fa fa-exclamation-triangle" /> Alerta
            </span>,
            <span>Hay errores en las líneas de detalle, solucionelos antes de continuar..</span>,
            '',
            'Cerrar',
            '',
          ),
        )
      }
    }
  }

  const RealizarCotizacion = (cotizacion) => {
    dispatch(registerQuotation(cotizacion))
    setState({
      ...state,
      active: 2,
    })
  }

  const CopiarCotizacion = (cotizacion) => {
    for (let i = 0; i < cotizacion.quotation_details.length; i++) {
      cotizacion.quotation_details[i].total = (
        cotizacion.quotation_details[i].price *
        1 *
        (cotizacion.quotation_details[i].quantity * 1)
      ).toFixed(2) //TODO: parametrizar
      cotizacion.quotation_details[i].errorPrice = false
      cotizacion.quotation_details[i].errorQuantity =
        cotizacion.quotation_details[i].quantity * 1 >
        cotizacion.quotation_details[i].maxQuantity * 1
      cotizacion.quotation_details[i].minPrice =
        cotizacion.quotation_details[i].product.price_wholesome
    }
    setState({
      ...state,
      lineas: cotizacion.quotation_details,
      comments: cotizacion.comments || '',
      docTotal: cotizacion.doc_total,
      doc_date: format(Date.now(), 'yyyy-MM-dd'),
      errDocDate: false,
      sucursalVenta: {
        value: cotizacion.branch.id,
        label: cotizacion.branch.name,
      },
      errBranch: '',
      active: 0,
    })
    dispatch(uiCloseModal())
  }

  const RefreshVentas = () => {
    dispatch(getVentas('lista'))
  }

  const RefreshCotizaciones = () => {
    dispatch(getCotizaciones('lista'))
  }

  return (
    <CRow>
      <CCol xs="6" className="d-print-none">
        <CCard>
          <CCardBody>
            <CTabs
              activeItemKey={active}
              onActiveTabChange={() => {
                setState({ ...state, active })
              }}
            >
              <CTabList variant="tabs">
                <CTab itemKey="0">
                  <i className="fa fa-tags" /> Productos
                </CTab>
                <CTab itemKey="1">
                  <i className="fa fa-money" /> Ventas Recientes
                </CTab>
                <CTab itemKey="2">
                  <i className="fa fa-file-text-o" /> Cotizaciones Recientes
                </CTab>
              </CTabList>
              {/* <CNav variant="tabs">
                <CNavItem>
                  <CNavLink>
                    <i className="fa fa-tags" /> Productos
                  </CNavLink>
                </CNavItem>
                <CNavItem>
                  <CNavLink>
                    <i className="fa fa-money" /> Ventas Recientes
                  </CNavLink>
                </CNavItem>
                <CNavItem>
                  <CNavLink>
                    <i className="fa fa-file-text-o" /> Cotizaciones Recientes
                  </CNavLink>
                </CNavItem>
              </CNav> */}
              <CTabContent>
                <CTabPanel className="pt-3" itemKey="0">
                  <CInputGroup>
                    <CInputGroupText>
                      <CIcon icon="cil-magnifying-glass" className="mr-1" />
                      Buscar
                    </CInputGroupText>
                    {/* <CInputGroupPrepend>
                    </CInputGroupPrepend> */}
                    <CFormInput
                      name="buscar"
                      value={buscar}
                      onChange={handleStateChange}
                      onKeyUp={handleKeyUp}
                      placeholder="Nombre o Código de Producto"
                    />
                  </CInputGroup>
                  {sucursalVenta === null ? (
                    <span className="text-danger small">debe elegir una sucursal</span>
                  ) : (
                    <span className="text-primary small">
                      Buscando productos en sucursal: <b>{sucursalVenta.label}</b>
                    </span>
                  )}
                  {/* <CFormGroup>
                  </CFormGroup> */}
                  {loading ? (
                    <h6>
                      <i className="fa fa-spinner fa-spin" /> buscando..
                    </h6>
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
                            openModal(item)
                          }}
                          key={x}
                        />
                      ))}
                    </CRow>
                  )}
                </CTabPanel>
                <CTabPanel className="pt-3" itemKey="1">
                  <div className="text-right mb-2">
                    <CButton
                      className="mr-1"
                      color="success"
                      size="sm"
                      variant="ghost"
                      onClick={RefreshVentas}
                    >
                      <i className="fa fa-refresh" />
                    </CButton>
                  </div>
                  {loading ? (
                    <span className="text-muted">
                      <i className="fa fa-spin fa-refresh" /> Cargando datos..
                    </span>
                  ) : (
                    <CListGroup accent>
                      {ventas.map((venta, x) => (
                        <CListGroupItem
                          accent={x % 2 === 0 ? 'primary' : 'secondary'}
                          color={x % 2 === 0 ? 'primary' : 'secondary'}
                          className="cursor-pointer"
                          action
                          onClick={() => {
                            openVentaModal(venta)
                          }}
                          key={venta.id}
                        >
                          <CRow>
                            <CCol xs="6">
                              <h5 className="text-primary m-0">BOB {venta.doc_total}</h5>
                            </CCol>
                            <CCol xs="6">
                              <CTooltip
                                content={format(venta.created_at, 'dd/MM/yyyy , h:mm:ss a')}
                              >
                                <span>{formatDistanceToNow(parseISO(venta.created_at))}</span>
                              </CTooltip>
                            </CCol>
                          </CRow>
                        </CListGroupItem>
                      ))}
                    </CListGroup>
                  )}
                </CTabPanel>
                <CTabPanel className="pt-3" itemKey="2">
                  <div className="text-right mb-2">
                    <CButton
                      className="mr-1"
                      color="success"
                      size="sm"
                      variant="ghost"
                      onClick={RefreshCotizaciones}
                    >
                      <i className="fa fa-refresh" />
                    </CButton>
                  </div>
                  {loading ? (
                    <span className="text-muted">
                      <i className="fa fa-spin fa-refresh" /> Cargando datos..
                    </span>
                  ) : (
                    <CListGroup accent>
                      {cotizaciones.map((cotizacion, x) => (
                        <CListGroupItem
                          accent={x % 2 === 0 ? 'info' : 'secondary'}
                          color={x % 2 === 0 ? 'info' : 'secondary'}
                          className="cursor-pointer"
                          action
                          onClick={() => {
                            openModalCotizacion(cotizacion)
                          }}
                          key={cotizacion.id}
                        >
                          <CRow>
                            <CCol xs="6">
                              <h5 className="text-info m-0">BOB {cotizacion.doc_total}</h5>
                            </CCol>
                            <CCol xs="6">
                              <CTooltip
                                content={format(cotizacion.created_at, 'dd/MM/yyyy , h:mm:ss a')}
                              >
                                <span>{formatDistanceToNow(parseISO(cotizacion.created_at))}</span>
                              </CTooltip>
                            </CCol>
                          </CRow>
                        </CListGroupItem>
                      ))}
                    </CListGroup>
                  )}
                </CTabPanel>
              </CTabContent>
            </CTabs>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs="6" className="d-print-none">
        <CCard>
          <CCardHeader>
            <span className="h1">Venta</span>
            <div className="card-header-actions">
              <CDropdown className="m-1">
                <CDropdownToggle color="primary">Acciones</CDropdownToggle>
                <CDropdownMenu>
                  <CDropdownItem
                    onClick={Vender}
                    className="text-primary"
                    disabled={lineas.length === 0}
                  >
                    <i className="fa fa-money pr-2" /> Realizar Venta
                  </CDropdownItem>
                  <CDropdownItem onClick={Cotizar} className="text-info">
                    <i className="fa fa-file-text-o pr-2" /> Realizar Cotización
                  </CDropdownItem>
                  <CDropdownDivider />
                  <CDropdownItem onClick={resetForm} className="text-danger">
                    <i className="fa fa-times pr-2" /> Borrar Formulario
                  </CDropdownItem>
                </CDropdownMenu>
              </CDropdown>
            </div>
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol xs="6">
                <CFormLabel htmlFor="branch">Sucursal</CFormLabel>
                <Select
                  value={sucursalVenta}
                  onChange={handleSelectChangeBranch}
                  options={sucursalesCombo}
                  isDisabled={lineas.length > 0}
                  name="branch"
                />
                <span className="text-danger small">{errBranch}</span>
              </CCol>
              <CCol xs="6">
                <CFormLabel htmlFor="doc_date">Fecha</CFormLabel>
                <CFormInput
                  type="date"
                  name="doc_date"
                  readOnly={true}
                  value={doc_date || ''}
                  onChange={handleStateChange}
                  invalid={errDocDate}
                  feedbackInvalid="este campo no puede estar vacío"
                />
              </CCol>
              <CCol xs="6">
                <CFormLabel htmlFor="total">Total</CFormLabel>
                <h1 className="text-success">
                  <span className="h3">BOB </span> {docTotal}
                </h1>
              </CCol>
              <CCol xs="6">
                <CFormLabel htmlFor="comments">Comentarios</CFormLabel>
                <CFormTextarea
                  value={comments}
                  onChange={handleStateChange}
                  name="comments"
                  rows="2"
                />
              </CCol>
              <CCol xs="12">
                <CFormLabel htmlFor="invoice">Factura</CFormLabel>
                <CFormSwitch
                  name="invoice"
                  className={'pt-2 ml-2'}
                  shape={'pill'}
                  size="lg"
                  color={'primary'}
                  // labelOn={'\u2713'}
                  // labelOff={'\u2715'}
                  checked={invoice}
                  onChange={() => {
                    setState({ ...state, invoice: !invoice })
                  }}
                />
              </CCol>
              {invoice && (
                <>
                  <CCol xs="4">
                    <CFormLabel htmlFor="invoice_number">Número de Factura</CFormLabel>
                    <CFormInput
                      type="text"
                      name="invoice_number"
                      value={invoice_number || ''}
                      onChange={handleStateChange}
                    />
                  </CCol>
                  <CCol xs="4">
                    <CFormLabel htmlFor="customer_number">NIT</CFormLabel>
                    <CFormInput
                      type="text"
                      name="customer_number"
                      value={customer_number || ''}
                      onChange={handleStateChange}
                    />
                  </CCol>
                  <CCol xs="4">
                    <CFormLabel htmlFor="customer">Razón Social</CFormLabel>
                    <CFormInput
                      type="text"
                      name="customer"
                      value={customer || ''}
                      onChange={handleStateChange}
                    />
                  </CCol>
                </>
              )}
            </CRow>

            <table className="table">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            {/* <CDataTable
              items={lineas}
              fields={fields}
              size="sm"
              striped
              noItemsViewSlot={
                <h6 className="text-center text-muted">No se agregaron productos</h6>
              }
              scopedSlots={{
                product: (item) => <td>{item.product.code + ' - ' + item.product.name}</td>,
                quantity: (item, x) => (
                  <td>
                    <CFormGroup className="mb-0">
                      <CInput
                        type="number"
                        size="sm"
                        max={item.maxQuantity}
                        min={1}
                        name={`q${x}`}
                        value={item.quantity}
                        invalid={item.errorQuantity}
                        valid={!item.errorQuantity}
                        onChange={handleLineasChange}
                      />
                      <CInvalidFeedback>
                        la cantidad debe estar entre 1 y {item.maxQuantity * 1}{' '}
                      </CInvalidFeedback>
                    </CFormGroup>
                  </td>
                ),
                price: (item, x) => (
                  <td>
                    <CFormGroup className="mb-0">
                      <CInput
                        className="text-right"
                        type="number"
                        size="sm"
                        min={item.minPrice}
                        name={`p${x}`}
                        value={item.price}
                        invalid={item.errorPrice}
                        valid={!item.errorPrice}
                        onChange={handleLineasChange}
                      />
                      <CInvalidFeedback>
                        el precio debe ser mayor a {item.minPrice * 1}
                      </CInvalidFeedback>
                    </CFormGroup>
                  </td>
                ),
                acciones: (item, x) => (
                  <td>
                    <CButton
                      color="danger"
                      variant="outline"
                      shape="square"
                      size="sm"
                      className="btn-icon"
                      onClick={() => {
                        handleClickRemove(x)
                      }}
                    >
                      <i className="fa fa-trash font-lg" />
                    </CButton>
                  </td>
                ),
              }}
            /> */}
          </CCardBody>
        </CCard>
      </CCol>
      <Dialog />
      <ModalDetalleProducto action={handleClickAdd} />
      <DialogVentas f1={RealizarVenta} />
      <DialogCotizaciones f1={RealizarCotizacion} />
      <ModalVentas />
      <ModalCotizaciones f1={CopiarCotizacion} />
    </CRow>
  )
}

export default POS
