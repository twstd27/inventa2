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
import { useDispatch, useSelector } from 'react-redux'
import { uiOpenDialog, uiOpenModal } from '../../actions/uiAction'
import { setUsuario } from '../../actions/usuariosAction'
import { colorBadge } from '../../helpers/global'
import CIcon from '@coreui/icons-react'
import { cilCheckAlt, cilPencil, cilX } from '@coreui/icons'

const TablaUsuarios = () => {
  const dispatch = useDispatch()
  const { usuarios } = useSelector((state) => state.usuarios)

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  })

  const paginas = []
  for (let i = 1; i <= Math.ceil(usuarios.length / pagination.pageSize); i++) {
    paginas.push({ value: i, label: i })
  }

  const columns = useMemo(
    () => [
      {
        accessorKey: 'nombre',
        header: 'NOMBRE',
        cell: ({ row }) => <span>{`${row.original.name} ${row.original.lastname}`}</span>,
      },
      {
        accessorKey: 'rol',
        header: 'ROL ASIGNADO',
      },
      {
        accessorKey: 'email',
        header: 'CORREO ELECTRÓNICO',
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
                  <CIcon icon={cilPencil} />
                </CButton>{' '}
                <CButton
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
    ],
    [dispatch],
  )

  const openModal = (usuario) => {
    dispatch(setUsuario(usuario))
    dispatch(
      uiOpenModal(
        <span>
          <CIcon icon={cilPencil} /> Editar Usuario
        </span>,
        'Guardar Cambios',
        'modificar',
      ),
    )
  }

  const toggleAlert = (tipo, usuario) => {
    dispatch(setUsuario(usuario))
    dispatch(
      uiOpenDialog(
        <span>
          <i className="fa fa-exclamation-triangle" /> Confirmación
        </span>,
        <span>
          ¿Está seguro que quiere cambiar el usuario a estado <strong>{tipo}</strong>?
        </span>,
        'Si',
        'No',
        tipo,
      ),
    )
  }

  const table = useReactTable({
    data: usuarios,
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
          <span className="pt-1 mx-2">{`Página ${pagination.pageIndex + 1} de ${Math.ceil(usuarios.length / pagination.pageSize)}`}</span>
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

export default TablaUsuarios
