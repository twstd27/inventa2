import React, { useMemo, useState, useEffect, useRef } from 'react'
import { colorBadge } from '../../helpers/global'
import {
  CBadge,
  CButton,
  CFormInput,
  CFormSelect,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CPagination,
  CPaginationItem,
} from '@coreui/react'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  getFilteredRowModel,
} from '@tanstack/react-table'
import { useUIStore } from '../../stores/useUIStore'
import { useVentasStore } from '../../stores/useVentasStore'
import { useLayoutStore } from '../../stores/useLayoutStore'
import { format } from 'date-fns'
import {
  Calendar,
  Check,
  Eye,
  IdCard,
  Pencil,
  ReceiptText,
  TriangleAlert,
  Trash2,
  User,
  X,
  Clock,
} from 'lucide-react'

const TablaVentas = () => {
  const { openVentasModal, openVentasDialog } = useUIStore()
  const loading = useUIStore((s) => s.loadingCount > 0)
  const { ventas, ultimaPagina, totalVentas, setVenta, getVentas } = useVentasStore()
  const { theme } = useLayoutStore()

  const [showDeleted, setShowDeleted] = useState(false)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [invoiceFilter, setInvoiceFilter] = useState('')
  const searchRef = useRef('')
  const debounceTimer = useRef(null)

  const [pagination, setPagination] = useState({ pageIndex: 1, pageSize: 5 })

  const paginas = []
  for (let i = 1; i <= ultimaPagina; i++) {
    paginas.push({ value: i, label: i })
  }

  useEffect(() => {
    getVentas('', pagination.pageIndex, pagination.pageSize, searchRef.current, showDeleted, startDate, endDate, invoiceFilter)
  }, [pagination, showDeleted, startDate, endDate, invoiceFilter])

  const handleSearch = ({ target }) => {
    clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(() => {
      searchRef.current = target.value
      setPagination((p) => ({ ...p, pageIndex: 1 }))
      getVentas('', 1, pagination.pageSize, target.value, showDeleted, startDate, endDate, invoiceFilter)
    }, 500)
  }

  const handleToggleDeleted = () => {
    setShowDeleted((prev) => !prev)
    setPagination((p) => ({ ...p, pageIndex: 1 }))
  }

  const handleStartDate = (e) => {
    setStartDate(e.target.value)
    setPagination((p) => ({ ...p, pageIndex: 1 }))
  }

  const handleEndDate = (e) => {
    setEndDate(e.target.value)
    setPagination((p) => ({ ...p, pageIndex: 1 }))
  }

  const handleInvoice = (e) => {
    setInvoiceFilter(e.target.value)
    setPagination((p) => ({ ...p, pageIndex: 1 }))
  }

  const openModal = (venta) => {
    setVenta(venta)
    openVentasModal(<><Eye /> Detalle de Venta</>, '', 'crear')
  }

  const toggleAlert = (tipo, venta) => {
    setVenta(venta)
    openVentasDialog(
      <TriangleAlert />,
      <span>Está seguro que quiere <b>eliminar</b> la venta? (esta acción no se puede deshacer)</span>,
      'Si', 'No', tipo,
    )
  }

  const columns = useMemo(
    () => [
      { accessorKey: 'id', header: '#' },
      { accessorKey: 'doc_total', header: 'TOTAL VENTA' },
      {
        accessorKey: 'doc_date',
        header: 'FECHA',
        cell: ({ row }) => (
          <span>
            <Calendar size={14} /> {format(row.original.created_at, 'dd/MM/yyyy')} <br />
            <Clock size={14} /> {format(row.original.created_at, 'h:mm:ss a')}
          </span>
        ),
      },
      {
        accessorKey: 'invoice',
        header: 'FACTURA',
        cell: ({ row }) => (
          <span>
            {row.original.invoice ? (
              <>
                <ReceiptText size={14} />: {row.original.invoice_number || '-'} <br />
                <IdCard size={14} />: {row.original.customer_number || '-'} <br />
                <User size={14} />: {row.original.customer || '-'}
              </>
            ) : '-'}
          </span>
        ),
      },
      {
        accessorKey: 'deleted_at',
        header: 'ESTADO',
        cell: ({ row }) => (
          <CBadge color={colorBadge(row.original.deleted_at === null ? 1 : 0)}>
            {row.original.deleted_at === null ? 'activo' : 'inactivo'}
          </CBadge>
        ),
      },
      {
        accessorKey: 'acciones',
        header: 'ACCIONES',
        cell: ({ row }) => (
          <div className="py-2">
            {row.original.deleted_at === null ? (
              <>
                <CButton color="primary" variant="outline" shape="rounded-0" onClick={() => openModal(row.original)}>
                  <Pencil size={16} />
                </CButton>{' '}
                <CButton color="danger" variant="outline" shape="rounded-0" onClick={() => toggleAlert('inactivo', row.original)}>
                  <X size={16} />
                </CButton>
              </>
            ) : (
              <CButton color="success" variant="outline" shape="rounded-0" onClick={() => toggleAlert('activo', row.original)}>
                <Check size={16} />
              </CButton>
            )}
          </div>
        ),
      },
    ],
    [],
  )

  const table = useReactTable({
    data: ventas,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: { pagination },
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
  })

  return (
    <div className="position-relative">
      {loading && (
        <div
          className="position-absolute w-100 h-100 d-flex justify-content-center align-items-center"
          style={{
            top: 0, left: 0, zIndex: 1000,
            backgroundColor: theme === 'light' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
          }}
        >
          <CBadge color="primary">
            <div className="spinner-border text-light spinner-border-sm" role="status">
              <span className="visually-hidden">cargando...</span>
            </div>
          </CBadge>
        </div>
      )}
      <div className="d-flex gap-2 mb-3 align-items-end flex-wrap">
        <div className="d-flex flex-column">
          <small className="text-medium-emphasis mb-1">Buscar</small>
          <CFormInput
            size="sm"
            placeholder="#ID, total, cliente, nº factura o producto..."
            onChange={handleSearch}
            style={{ maxWidth: '280px' }}
          />
        </div>
        <div className="d-flex flex-column">
          <small className="text-medium-emphasis mb-1">Fecha desde</small>
          <CFormInput
            size="sm"
            type="date"
            value={startDate}
            onChange={handleStartDate}
            style={{ maxWidth: '160px' }}
          />
        </div>
        <div className="d-flex flex-column">
          <small className="text-medium-emphasis mb-1">Fecha hasta</small>
          <CFormInput
            size="sm"
            type="date"
            value={endDate}
            onChange={handleEndDate}
            style={{ maxWidth: '160px' }}
          />
        </div>
        <div className="d-flex flex-column">
          <small className="text-medium-emphasis mb-1">Factura</small>
          <CFormSelect
            size="sm"
            value={invoiceFilter}
            onChange={handleInvoice}
            style={{ maxWidth: '160px' }}
          >
            <option value="">Todas</option>
            <option value="yes">Con factura</option>
            <option value="no">Sin factura</option>
          </CFormSelect>
        </div>
        <CButton
          size="sm"
          color={showDeleted ? 'warning' : 'secondary'}
          variant="outline"
          onClick={handleToggleDeleted}
        >
          <Trash2 size={14} className="me-1" />
          {showDeleted ? 'Ocultar eliminados' : 'Ver eliminados'}
        </CButton>
      </div>
      <CTable hover bordered responsive>
        <CTableHead className="table-header-color">
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
      <CPagination aria-label="Page navigation" size="sm" className="cursor-pointer">
        <CPaginationItem onClick={() => table.setPageIndex(1)} disabled={pagination.pageIndex <= 1}>{'<<'}</CPaginationItem>
        <CPaginationItem onClick={() => table.setPageIndex(pagination.pageIndex - 1)} disabled={pagination.pageIndex <= 1}>{'<'}</CPaginationItem>
        <CPaginationItem onClick={() => table.setPageIndex(pagination.pageIndex + 1)} disabled={pagination.pageIndex >= ultimaPagina}>{'>'}</CPaginationItem>
        <CPaginationItem onClick={() => table.setPageIndex(ultimaPagina)} disabled={pagination.pageIndex >= ultimaPagina}>{'>>'}</CPaginationItem>
        <div className="w-100 d-flex justify-content-between">
          <span className="pt-1 mx-2">{`Página ${pagination.pageIndex} de ${ultimaPagina}`}</span>
          <span className="pt-1 mx-2">{`${totalVentas} registros`}</span>
          <div className="flex items-center">
            <span className="flex items-center">Ir a la página: </span>
            <CFormSelect
              size="sm"
              className="d-inline-block w-auto"
              value={table.getState().pagination.pageIndex}
              onChange={(e) => { const page = e.target.value ? Number(e.target.value) : 1; table.setPageIndex(page) }}
              options={paginas}
              name="pagina"
            />
          </div>
        </div>
      </CPagination>
    </div>
  )
}

export default TablaVentas
