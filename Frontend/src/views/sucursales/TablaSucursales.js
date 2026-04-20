import React, { useState, useMemo, useEffect } from 'react'
import { colorBadge } from '../../helpers/global'
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
import { useSucursalesStore } from '../../stores/useSucursalesStore'
import CIcon from '@coreui/icons-react'
import { cilCheckAlt, cilPencil, cilX, cilWarning } from '@coreui/icons'
import { Trash2 } from 'lucide-react'

const TablaSucursales = () => {
  const { openModal, openDialog } = useUIStore()
  const { sucursales, setSucursal } = useSucursalesStore()

  const [searchText, setSearchText] = useState('')
  const [showDeleted, setShowDeleted] = useState(false)

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  })

  useEffect(() => {
    setPagination((p) => ({ ...p, pageIndex: 0 }))
  }, [searchText, showDeleted])

  const filteredData = useMemo(() => {
    let d = showDeleted ? sucursales : sucursales.filter((x) => x.deleted_at === null)
    if (searchText) {
      const s = searchText.toLowerCase()
      d = d.filter(
        (x) =>
          x.name?.toLowerCase().includes(s) ||
          x.address?.toLowerCase().includes(s) ||
          x.phone?.toLowerCase().includes(s),
      )
    }
    return d
  }, [sucursales, searchText, showDeleted])

  const totalPages = Math.max(1, Math.ceil(filteredData.length / pagination.pageSize))

  const paginas = []
  for (let i = 1; i <= totalPages; i++) {
    paginas.push({ value: i, label: i })
  }

  const openModal_ = (sucursal) => {
    setSucursal(sucursal)
    openModal(
      <span>
        <CIcon icon={cilPencil} /> Editar Sucursal
      </span>,
      'Guardar Cambios',
      'modificar',
    )
  }

  const toggleAlert = (tipo, sucursal) => {
    setSucursal(sucursal)
    openDialog(
      <span>
        <CIcon icon={cilWarning} /> Confirmación
      </span>,
      <span>
        Está seguro que quiere cambiar la sucursal a estado <strong>{tipo}</strong>?
      </span>,
      'Si',
      'No',
      tipo,
    )
  }

  const columns = useMemo(
    () => [
      {
        accessorKey: 'acciones',
        header: 'ACCIONES',
        cell: ({ row }) => (
          <div
            className="d-flex align-items-center flex-row flex-sm-row flex-column flex-md-row"
            style={{ gap: '2px' }}
          >
            {row.original.deleted_at === null ? (
              <>
                <CButton
                  size="sm"
                  color="primary"
                  variant="outline"
                  shape="rounded-0"
                  onClick={() => openModal_(row.original)}
                >
                  <CIcon icon={cilPencil} />
                </CButton>{' '}
                <CButton
                  size="sm"
                  color="danger"
                  variant="outline"
                  shape="rounded-0"
                  onClick={() => toggleAlert('inactivo', row.original)}
                >
                  <CIcon icon={cilX} />
                </CButton>
              </>
            ) : (
              <CButton
                size="sm"
                color="success"
                variant="outline"
                shape="rounded-0"
                onClick={() => toggleAlert('activo', row.original)}
              >
                <CIcon icon={cilCheckAlt} />
              </CButton>
            )}
          </div>
        ),
      },
      {
        accessorKey: 'name',
        header: 'NOMBRE',
      },
      {
        accessorKey: 'address',
        header: 'DIRECCIÓN',
      },
      {
        accessorKey: 'phone',
        header: 'TELÉFONO',
        cell: ({ row }) => <span>{row.original.phone ? row.original.phone : ''}</span>,
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
    ],
    [],
  )

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination,
    },
    getFilteredRowModel: getFilteredRowModel(),
  })

  return (
    <>
      <div className="d-flex gap-2 mb-3 align-items-center flex-wrap">
        <CFormInput
          size="sm"
          placeholder="Buscar..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ maxWidth: '300px' }}
        />
        <CButton
          size="sm"
          color={showDeleted ? 'warning' : 'secondary'}
          variant="outline"
          onClick={() => setShowDeleted(!showDeleted)}
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
        <CPaginationItem onClick={() => table.firstPage()} disabled={!table.getCanPreviousPage()}>
          {'<<'}
        </CPaginationItem>
        <CPaginationItem
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'<'}
        </CPaginationItem>
        <CPaginationItem onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          {'>'}
        </CPaginationItem>
        <CPaginationItem onClick={() => table.lastPage()} disabled={!table.getCanNextPage()}>
          {'>>'}
        </CPaginationItem>
        <div className="w-100 d-flex justify-content-between">
          <span className="pt-1 mx-2">{`Página ${pagination.pageIndex + 1} de ${totalPages}`}</span>
          <div className="flex items-center">
            <span className="flex items-center">Ir a la página: </span>
            <CFormSelect
              size="sm"
              aria-label="Small select"
              className="d-inline-block w-auto"
              value={table.getState().pagination.pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0
                table.setPageIndex(page)
              }}
              options={paginas}
              name="pagina"
            ></CFormSelect>
          </div>
        </div>
      </CPagination>
    </>
  )
}

export default TablaSucursales
