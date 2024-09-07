import React, { useMemo, useState, useEffect } from 'react'
import { colorBadge } from '../../helpers/global'
import {
  CBadge,
  CButton,
  CTooltip,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CPagination,
  CPaginationItem,
  CFormSelect,
} from '@coreui/react'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  getFilteredRowModel,
} from '@tanstack/react-table'
import { useDispatch, useSelector } from 'react-redux'
import { uiOpenVentasDialog, uiOpenVentasModal } from '../../actions/uiAction'
import { setVenta, getVentas } from '../../actions/ventasAction'
import { format } from 'date-fns'
import {
  Calendar,
  Check,
  Eye,
  IdCard,
  Pencil,
  ReceiptText,
  TriangleAlert,
  User,
  X,
  Clock,
} from 'lucide-react'

const TablaVentas = () => {
  const dispatch = useDispatch()
  const { ventas, paginaActual, ultimaPagina, totalVentas } = useSelector((state) => state.ventas)

  const { theme } = useSelector((state) => state.layout)
  const { loading } = useSelector((state) => state.ui)

  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 5,
  })

  const paginas = []
  for (let i = 1; i <= ultimaPagina; i++) {
    paginas.push({ value: i, label: i })
  }

  useEffect(() => {
    dispatch(getVentas('', pagination.pageIndex, pagination.pageSize))
  }, [dispatch, pagination])

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: '#',
      },
      {
        accessorKey: 'doc_total',
        header: 'TOTAL VENTA',
      },
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
            ) : (
              '-'
            )}
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
                <CButton
                  color="primary"
                  variant="outline"
                  shape="rounded-0"
                  onClick={() => openModal(row.original)}
                >
                  <Pencil size={16} />
                </CButton>{' '}
                <CButton
                  color="danger"
                  variant="outline"
                  shape="rounded-0"
                  onClick={() => toggleAlert('inactivo', row.original)}
                >
                  <X size={16} />
                </CButton>
              </>
            ) : (
              <CButton
                color="success"
                variant="outline"
                shape="rounded-0"
                onClick={() => toggleAlert('activo', row.original)}
              >
                <Check size={16} />
              </CButton>
            )}
          </div>
        ),
      },
    ],
    [dispatch],
  )

  const table = useReactTable({
    data: ventas,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination,
    },
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
  })

  const openModal = (producto) => {
    dispatch(setVenta(producto))
    dispatch(
      uiOpenVentasModal(
        <>
          <Eye /> Detalle de Venta
        </>,
        '',
        'crear',
      ),
    )
  }

  const toggleAlert = (tipo, venta) => {
    dispatch(setVenta(venta))
    dispatch(
      uiOpenVentasDialog(
        <TriangleAlert />,
        <span>
          Está seguro que quiere <b>eliminar</b> la venta? (esta acción no se puede deshacer)
        </span>,
        'Si',
        'No',
        tipo,
      ),
    )
  }

  return (
    <div className="position-relative">
      {loading && (
        <div
          className="position-absolute w-100 h-100 d-flex justify-content-center align-items-center"
          style={{
            top: 0,
            left: 0,
            backgroundColor: theme == 'light' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
            zIndex: 1000,
          }}
        >
          <CBadge color="primary">
            <div className="spinner-border text-light spinner-border-sm" role="status">
              <span className="visually-hidden">cargando...</span>
            </div>
          </CBadge>
        </div>
      )}
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
        <CPaginationItem onClick={() => table.setPageIndex(1)} disabled={pagination.pageIndex <= 1}>
          {'<<'}
        </CPaginationItem>
        <CPaginationItem
          onClick={() => table.setPageIndex(pagination.pageIndex - 1)}
          disabled={pagination.pageIndex <= 1}
        >
          {'<'}
        </CPaginationItem>
        <CPaginationItem
          onClick={() => table.setPageIndex(pagination.pageIndex + 1)}
          disabled={pagination.pageIndex >= ultimaPagina}
        >
          {'>'}
        </CPaginationItem>
        <CPaginationItem
          onClick={() => table.setPageIndex(ultimaPagina)}
          disabled={pagination.pageIndex >= ultimaPagina}
        >
          {'>>'}
        </CPaginationItem>
        <div className="w-100 d-flex justify-content-between">
          <span className="pt-1 mx-2">{`Página ${pagination.pageIndex} de ${ultimaPagina}`}</span>
          <span className="pt-1 mx-2">{`${totalVentas} registros`}</span>
          <div className="flex items-center">
            <span className="flex items-center">Ir a la página: </span>
            <CFormSelect
              size="sm"
              aria-label="Small select"
              className="d-inline-block w-auto"
              value={table.getState().pagination.pageIndex}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) : 1
                table.setPageIndex(page)
              }}
              options={paginas}
              name="pagina"
            ></CFormSelect>
          </div>
        </div>
      </CPagination>
    </div>
  )
}

export default TablaVentas
