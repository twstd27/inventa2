import React, { useState, useMemo, useEffect, useRef } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  getFilteredRowModel,
} from '@tanstack/react-table'
import {
  CBadge,
  CButton,
  CPagination,
  CPaginationItem,
  CFormSelect,
  CFormInput,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { useUIStore } from '../../stores/useUIStore'
import { useStockStore } from '../../stores/useStockStore'
import { useLayoutStore } from '../../stores/useLayoutStore'
import { colorBadge } from '../../helpers/global'
import CIcon from '@coreui/icons-react'
import { cilCheckAlt, cilPencil, cilX, cilWarning } from '@coreui/icons'
import { Trash2 } from 'lucide-react'

const TablaEntradas = () => {
  const { openModal, openDialog } = useUIStore()
  const loading = useUIStore((s) => s.loadingCount > 0)
  const { entradas, ultimaPagina, totalEntradas, setEntrada, getEntradas } = useStockStore()
  const { theme } = useLayoutStore()

  const [showDeleted, setShowDeleted] = useState(false)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const searchRef = useRef('')
  const codeRef = useRef('')
  const debounceTimer = useRef(null)

  const [pagination, setPagination] = useState({ pageIndex: 1, pageSize: 5 })

  const paginas = []
  for (let i = 1; i <= ultimaPagina; i++) {
    paginas.push({ value: i, label: i })
  }

  useEffect(() => {
    getEntradas(pagination.pageIndex, pagination.pageSize, searchRef.current, showDeleted, startDate, endDate, codeRef.current)
  }, [pagination, showDeleted, startDate, endDate])

  const handleSearch = ({ target }) => {
    clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(() => {
      searchRef.current = target.value
      setPagination((p) => ({ ...p, pageIndex: 1 }))
      getEntradas(1, pagination.pageSize, target.value, showDeleted, startDate, endDate, codeRef.current)
    }, 500)
  }

  const handleCodeSearch = ({ target }) => {
    clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(() => {
      codeRef.current = target.value
      setPagination((p) => ({ ...p, pageIndex: 1 }))
      getEntradas(1, pagination.pageSize, searchRef.current, showDeleted, startDate, endDate, target.value)
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

  const openModal_ = (entrada) => {
    setEntrada(entrada)
    openModal(
      <span><CIcon icon={cilPencil} /> Editar entrada de inventario</span>,
      'Guardar Cambios',
      { action: 'modificar', type: 'entrada' },
    )
  }

  const toggleAlert = (accion, entrada) => {
    setEntrada(entrada)
    openDialog(
      <span><CIcon icon={cilWarning} /> Confirmación</span>,
      <span>Está seguro que quiere cambiar la entrada de inventario a estado <strong>{accion}</strong>?</span>,
      'Si', 'No', accion,
    )
  }

  const columns = useMemo(
    () => [
      { accessorKey: 'id', header: '#' },
      {
        accessorKey: 'nombre',
        header: 'NOMBRE',
        cell: ({ row }) => <span>{row.original.branch?.name}</span>,
      },
      {
        accessorKey: 'entry_details',
        header: 'PRODUCTOS',
        cell: ({ row }) => (
          <span>
            {row.original.entry_details?.map((entryDetail, i) => (
              <CBadge className="mr-1" key={i} color="primary">{entryDetail.product.name}</CBadge>
            ))}
          </span>
        ),
      },
      {
        accessorKey: 'doc_date_format',
        header: 'FECHA',
        cell: ({ row }) => <span>{row.original.doc_date_format}</span>,
      },
      { accessorKey: 'comments', header: 'COMENTARIOS' },
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
          <span className="py-2">
            {row.original.deleted_at === null ? (
              <>
                <CButton color="primary" variant="outline" shape="square" onClick={() => openModal_(row.original)}>
                  <CIcon icon={cilPencil} />
                </CButton>{' '}
                <CButton color="danger" variant="outline" shape="square" onClick={() => toggleAlert('inactivo', row.original)}>
                  <CIcon icon={cilX} />
                </CButton>
              </>
            ) : (
              <CButton color="success" variant="outline" shape="square" onClick={() => toggleAlert('activo', row.original)}>
                <CIcon icon={cilCheckAlt} />
              </CButton>
            )}
          </span>
        ),
      },
    ],
    [],
  )

  const table = useReactTable({
    data: entradas,
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
            placeholder="Sucursal, producto o comentarios..."
            onChange={handleSearch}
            style={{ maxWidth: '260px' }}
          />
        </div>
        <div className="d-flex flex-column">
          <small className="text-medium-emphasis mb-1">Código de artículo</small>
          <CFormInput
            size="sm"
            placeholder="Ej: ART-001"
            onChange={handleCodeSearch}
            style={{ maxWidth: '160px' }}
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
        <CTableHead>
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
                <CTableDataCell key={cell.id}>
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
          <span className="pt-1 mx-2">{`${totalEntradas} registros`}</span>
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

export default TablaEntradas
