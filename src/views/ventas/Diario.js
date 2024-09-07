import React, { useState, useEffect, useMemo } from 'react'
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

const DiarioVentas = () => {
  const dispatch = useDispatch()
  const { loading } = useSelector((state) => state.ui)
  const { diario } = useSelector((state) => state.ventas)
  const { sucursalesCombo } = useSelector((state) => state.sucursales)
  const [state, setState] = useState({
    doc_date: format(Date.now(), 'yyyy-MM-dd'),
    sucursalVenta: null,
    total: 0,
    profit: 0,
    tax: 0,
  })
  const { doc_date, sucursalVenta, total, profit, tax } = state

  useEffect(() => {
    setState({
      ...state,
      total: 0,
      profit: 0,
      tax: 0,
    })
    totalesRegistros()
  }, [diario])

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'VENTA',
      },
      {
        accessorKey: 'invoice',
        header: 'FACTURA',
        cell: ({ row }) => <span>{row.original.invoice === 1 ? 'si' : 'no'}</span>,
      },
      {
        accessorKey: 'code',
        header: 'CÓDIGO',
      },
      {
        accessorKey: 'name',
        header: 'NOMBRE',
      },
      {
        accessorKey: 'quantity',
        header: 'CANTIDAD',
      },
      {
        accessorKey: 'price',
        header: 'PRECIO',
      },
      {
        accessorKey: 'total',
        header: 'SUBTOTAL',
        cell: ({ row }) => (
          <span className="text-right">{(row.original.total * 1).toFixed(2)}</span>
        ),
      },
      {
        accessorKey: 'cost',
        header: 'COSTO/U',
      },
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
    ],
    [dispatch],
  )

  const table = useReactTable({
    data: diario,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const handleStateChange = ({ target }) => {
    setState({
      ...state,
      [target.name]: target.value,
    })
    buscarRegistros(target.value, sucursalVenta?.value || '')
  }

  const handleSelectChangeBranch = (values) => {
    setState({
      ...state,
      sucursalVenta: values,
    })
    buscarRegistros(doc_date, values.value)
  }

  const buscarRegistros = (fecha, sucursal) => {
    if (fecha !== '') {
      if (sucursal !== null && sucursal !== undefined) {
        dispatch(getDiario({ fecha, sucursal }))
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

  return (
    <CRow>
      <CCol xs="12">
        <CCard>
          <CCardBody>
            <CRow>
              <CCol xs="3" className="d-print-none">
                <CFormLabel htmlFor="branch">Sucursal</CFormLabel>
                <Select
                  value={sucursalVenta}
                  onChange={handleSelectChangeBranch}
                  options={sucursalesCombo}
                  name="branch"
                />
              </CCol>
              <CCol xs="3" className="d-print-none">
                <CFormInput
                  type="date"
                  label="Fecha"
                  name="doc_date"
                  value={doc_date || ''}
                  onChange={handleStateChange}
                />
              </CCol>
              <CCol xs="6" className="mt-4 d-print-none">
                <CButton
                  color="primary"
                  disabled={loading}
                  onClick={() => {
                    window.print()
                  }}
                >
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
              <CCol xs="12" className="print-div">
                <div>
                  <h2>{sucursalVenta?.label}</h2>
                  <h2 className="text-center">
                    <b>DIARIO</b> {/*<span className="h3">ENTRADA DATOS</span> */}
                  </h2>
                  <h5>
                    <b>FECHA: </b>
                    {format(doc_date, 'dd/MM/yyyy')}
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
                <CContainer>
                  <CRow>
                    <CCol xs={8}></CCol>
                    <CCol xs={2} className="d-flex flex-column justify-content-end text-right">
                      <span>
                        <b>Total:</b>
                      </span>
                      <span>
                        <b>Impuesto</b>
                      </span>
                      <span>
                        <b>Ganacia</b>
                      </span>
                    </CCol>
                    <CCol xs={2} className="d-flex flex-column justify-content-end text-right">
                      <span>
                        <b>{total}</b>
                      </span>
                      <span>
                        <b>{tax}</b>
                      </span>
                      <span>
                        <b>{profit}</b>
                      </span>
                    </CCol>
                  </CRow>
                </CContainer>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default DiarioVentas
