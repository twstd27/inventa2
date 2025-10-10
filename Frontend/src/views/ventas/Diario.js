import React, { useState, useEffect, useMemo, useRef } from 'react'
import {
  CButton,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CFormLabel,
  CFormInput,
  CContainer,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table'
import { useDispatch, useSelector } from 'react-redux'
import { getDiario } from '../../actions/ventasAction'
import { format } from 'date-fns'
import Select from 'react-select'
import SpinningIcon from '../../components/shared/SpinningIcon'
import { Printer } from 'lucide-react'
import { useReactToPrint } from 'react-to-print'

const DiarioVentas = () => {
  const dispatch = useDispatch()
  const { loading } = useSelector((state) => state.ui)
  const { diario } = useSelector((state) => state.ventas)
  const { sucursalesCombo } = useSelector((state) => state.sucursales)
  const componentRef = useRef(null)
  const [state, setState] = useState({
    start_date: format(Date.now(), 'yyyy-MM-dd'),
    end_date: format(Date.now(), 'yyyy-MM-dd'),
    sucursalVenta: null,
    total: 0,
    profit: 0,
    tax: 0,
  })
  const { start_date, end_date, sucursalVenta, total, profit, tax } = state

  const { usuario } = useSelector((state) => state.auth)
  console.log(usuario)

  useEffect(() => {
    setState({
      ...state,
      total: 0,
      profit: 0,
      tax: 0,
    })
    totalesRegistros()
  }, [diario])

  // const columns = useMemo(
  //   () => [
  //     {
  //       accessorKey: 'id',
  //       header: 'VENTA',
  //     },
  //     {
  //       accessorKey: 'doc_date',
  //       header: 'FECHA',
  //     },
  //     {
  //       accessorKey: 'invoice',
  //       header: 'FACTURA',
  //       cell: ({ row }) => <span>{row.original.invoice === 1 ? 'si' : 'no'}</span>,
  //     },
  //     {
  //       accessorKey: 'code',
  //       header: 'CÓDIGO',
  //     },
  //     {
  //       accessorKey: 'name',
  //       header: 'NOMBRE',
  //     },
  //     {
  //       accessorKey: 'quantity',
  //       header: 'CANTIDAD',
  //     },
  //     {
  //       accessorKey: 'price',
  //       header: 'PRECIO',
  //     },
  //     {
  //       accessorKey: 'total',
  //       header: 'SUBTOTAL',
  //       cell: ({ row }) => (
  //         <span className="text-right">{(row.original.total * 1).toFixed(2)}</span>
  //       ),
  //     },
  //     {
  //       accessorKey: 'cost',
  //       header: 'COSTO/U',
  //     },
  //     {
  //       accessorKey: 'cost_total',
  //       header: 'SUBTOTAL COSTO',
  //       cell: ({ row }) => (
  //         <span className="text-right">
  //           {(row.original.quantity * 1 * (row.original.cost * 1)).toFixed(2)}
  //         </span>
  //       ),
  //     },
  //     {
  //       accessorKey: 'profit',
  //       header: 'GANANCIA',
  //       cell: ({ row }) => (
  //         <span className="text-right">{(row.original.profit * 1).toFixed(2)}</span>
  //       ),
  //     },
  //   ],
  //   [dispatch],
  // )

  const columns = useMemo(() => {
    // columnas base visibles para todos
    const baseColumns = [
      { accessorKey: 'id', header: 'VENTA' },
      { accessorKey: 'doc_date', header: 'FECHA' },
      {
        accessorKey: 'invoice',
        header: 'FACTURA',
        cell: ({ row }) => <span>{row.original.invoice === 1 ? 'si' : 'no'}</span>,
      },
      { accessorKey: 'code', header: 'CÓDIGO' },
      { accessorKey: 'name', header: 'NOMBRE' },
      { accessorKey: 'quantity', header: 'CANTIDAD' },
      { accessorKey: 'price', header: 'PRECIO' },
      {
        accessorKey: 'total',
        header: 'SUBTOTAL',
        cell: ({ row }) => (
          <span className="text-right">{(row.original.total * 1).toFixed(2)}</span>
        ),
      },
    ]

    // columnas restringidas solo para role_id === 1
    const adminColumns = [
      { accessorKey: 'cost', header: 'COSTO/U' },
      {
        accessorKey: 'cost_total',
        header: 'SUBTOTAL COSTO',
        cell: ({ row }) => (
          <span className="text-right">
            {(row.original.quantity * 1 * (row.original.cost * 1)).toFixed(2)}
          </span>
        ),
      },
      {
        accessorKey: 'profit',
        header: 'GANANCIA',
        cell: ({ row }) => (
          <span className="text-right">{(row.original.profit * 1).toFixed(2)}</span>
        ),
      },
    ]

    // si el usuario tiene role_id = 1, agregamos esas columnas
    return usuario?.role_id === 1 ? [...baseColumns, ...adminColumns] : baseColumns
  }, [dispatch, usuario])

  const table = useReactTable({
    data: diario,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  // Un solo handler para todos los cambios
  const handleStateChange = ({ target }) => {
    const newState = {
      ...state,
      [target.name]: target.value,
    }
    setState(newState)
  }

  const handleSelectChangeBranch = (values) => {
    const newState = {
      ...state,
      sucursalVenta: values,
    }
    setState(newState)
  }

  // Buscar cada vez que cambie alguno de los filtros
  useEffect(() => {
    if (start_date && end_date && sucursalVenta && sucursalVenta.value) {
      buscarRegistros(start_date, end_date, sucursalVenta.value)
    }
  }, [start_date, end_date, sucursalVenta])

  const buscarRegistros = (startDate, endDate, sucursal) => {
    if (startDate !== '' && endDate !== '') {
      if (sucursal !== null && sucursal !== undefined) {
        dispatch(getDiario({ startDate, endDate, sucursal }))
      }
    }
  }

  const totalesRegistros = () => {
    if (diario.length > 0) {
      const aux = JSON.parse(JSON.stringify(diario))
      let auxTotal = 0
      let auxTax = 0
      let auxProfit = 0
      aux.forEach((item) => {
        auxTotal += item.total * 1
        auxProfit += item.profit * 1
        if (item.invoice === 1) {
          auxTax += item.total * 1
        }
      })
      auxTax *= 0.03
      auxProfit -= auxTax
      setState({
        ...state,
        total: auxTotal.toFixed(2),
        tax: auxTax.toFixed(2),
        profit: auxProfit.toFixed(2),
      })
    }
  }

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `${sucursalVenta}_${start_date}_${end_date}_diario_ventas`,
  })

  return (
    <CRow>
      <CCol xs="12">
        <CCard>
          <CCardBody>
            <CRow>
              <CCol md="3">
                <CFormLabel htmlFor="branch">Sucursal</CFormLabel>
                <Select
                  value={sucursalVenta}
                  onChange={handleSelectChangeBranch}
                  options={sucursalesCombo}
                  name="branch"
                />
              </CCol>
              <CCol md="3">
                <CFormInput
                  type="date"
                  label="Fecha Inicio"
                  name="start_date"
                  value={start_date || ''}
                  onChange={handleStateChange}
                />
              </CCol>
              <CCol md="3">
                <CFormInput
                  type="date"
                  label="Fecha Fin"
                  name="end_date"
                  value={end_date || ''}
                  onChange={handleStateChange}
                />
              </CCol>
              <CCol md="3" className="mt-4">
                <CButton color="primary" disabled={loading} onClick={handlePrint}>
                  {loading ? (
                    <>
                      <SpinningIcon size={16} color="white" speed="slow" className="ml-2" />{' '}
                      Cargando Datos
                    </>
                  ) : (
                    <span>
                      <Printer size={16} className="ml-2" /> Imprimir
                    </span>
                  )}
                </CButton>
              </CCol>
              <CCol xs="12" className="separator" />
              <CCol xs="12" className="table-responsive">
                <div ref={componentRef} className="table-print">
                  <div>
                    <h2>{sucursalVenta?.label}</h2>
                    <h2 className="text-center">
                      <b>DIARIO</b> {/*<span className="h3">ENTRADA DATOS</span> */}
                    </h2>
                    <h5>
                      <b>RANGO DE FECHAS: </b>
                      {format(new Date(start_date), 'dd/MM/yyyy')} -{' '}
                      {format(new Date(end_date), 'dd/MM/yyyy')}
                    </h5>
                  </div>
                  <CTable small bordered>
                    <CTableHead className="table-header-color table-sm">
                      {table.getHeaderGroups().map((headerGroup) => (
                        <CTableRow key={headerGroup.id}>
                          {headerGroup.headers.map((header) => (
                            <CTableHeaderCell key={header.id} className="table-header-color">
                              {flexRender(header.column.columnDef.header, header.getContext())}
                            </CTableHeaderCell>
                          ))}
                        </CTableRow>
                      ))}
                    </CTableHead>
                    <CTableBody>
                      {table.getRowModel().rows.map((row) => (
                        <CTableRow key={row.id}>
                          {row.getVisibleCells().map((cell) => (
                            <CTableDataCell key={cell.id} className="middle-align">
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </CTableDataCell>
                          ))}
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                  <CRow>
                    <CCol xs={8}></CCol>
                    <CCol xs={2} className="d-flex flex-column justify-content-end text-right">
                      <span>
                        <b>Total:</b>
                      </span>
                      <span>
                        <b>Impuesto</b>
                      </span>
                      {usuario?.role_id === 1 && (
                        <span>
                          <b>Ganancia</b>
                        </span>
                      )}
                    </CCol>
                    <CCol xs={2} className="d-flex flex-column justify-content-end text-right">
                      <span>
                        <b>{total}</b>
                      </span>
                      <span>
                        <b>{tax}</b>
                      </span>
                      {usuario?.role_id === 1 && (
                        <span>
                          <b>{profit}</b>
                        </span>
                      )}
                    </CCol>
                  </CRow>
                </div>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default DiarioVentas
