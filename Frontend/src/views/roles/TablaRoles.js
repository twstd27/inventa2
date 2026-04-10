import React, { useState, useMemo } from 'react'
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
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { useUIStore } from '../../stores/useUIStore'
import { useRolesStore } from '../../stores/useRolesStore'
import { colorBadge } from '../../helpers/global'
import CIcon from '@coreui/icons-react'
import { cilCheckAlt, cilPencil, cilX, cilWarning } from '@coreui/icons'

const TablaRoles = () => {
  const { openModal, openDialog } = useUIStore()
  const { roles, setRol } = useRolesStore()

  const openModal_ = (rol) => {
    setRol(rol)
    openModal(
      <span>
        <CIcon icon={cilPencil} /> Editar Rol
      </span>,
      'Guardar Cambios',
      'modificar',
    )
  }

  const toggleAlert = (tipo, rol) => {
    setRol(rol)
    openDialog(
      <span>
        <CIcon icon={cilWarning} /> Confirmación
      </span>,
      <span>
        ¿Está seguro que quiere cambiar el rol a estado <strong>{tipo}</strong>?
      </span>,
      'Si',
      'No',
      tipo,
    )
  }

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  })

  const paginas = []
  for (let i = 1; i <= Math.ceil(roles.length / pagination.pageSize); i++) {
    paginas.push({ value: i, label: i })
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
                  shape="square"
                  onClick={() => {
                    openModal_(row.original)
                  }}
                >
                  <CIcon icon={cilPencil} />
                </CButton>{' '}
                <CButton
                  size="sm"
                  color="danger"
                  variant="outline"
                  shape="square"
                  onClick={() => {
                    toggleAlert('inactivo', row.original)
                  }}
                >
                  <CIcon icon={cilX} />
                </CButton>
              </>
            ) : (
              <CButton
                size="sm"
                color="success"
                variant="outline"
                shape="square"
                onClick={() => {
                  toggleAlert('activo', row.original)
                }}
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
        filterFn: 'includesString',
      },
      {
        accessorKey: 'permissions',
        header: 'PERMISOS',
        cell: ({ row }) => (
          <span>
            {row.original.permissions.map((permission, i) => (
              <CBadge className="mr-1" key={i} color="primary">
                {permission.label}
              </CBadge>
            ))}
          </span>
        ),
        filterFn: 'includesString',
      },
      {
        accessorKey: 'deleted_at',
        header: 'ESTADO',
        cell: ({ row }) => (
          <CBadge color={colorBadge(row.original.deleted_at === null ? 1 : 0)}>
            {row.original.deleted_at === null ? 'activo' : 'inactivo'}
          </CBadge>
        ),
        filterFn: 'equals',
      },
    ],
    [],
  )

  const table = useReactTable({
    data: roles,
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
      <CTable hover bordered responsive>
        <CTableHead className="table-header-color">
          {table.getHeaderGroups().map((headerGroup) => (
            <CTableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <CTableHeaderCell key={header.id}>
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
          <span className="pt-1 mx-2">{`Página ${pagination.pageIndex + 1} de ${Math.ceil(roles.length / pagination.pageSize)}`}</span>
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

export default TablaRoles
