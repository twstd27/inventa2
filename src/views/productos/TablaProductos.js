import React, { useState, useMemo, useEffect } from 'react'
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
import {
  uiOpenModal,
  uiOpenProductoEtiquetaModal,
  uiOpenProductosDialog,
} from '../../actions/uiAction'

import { setProducto } from '../../actions/productosAction'
import { colorBadge } from '../../helpers/global'
import CIcon from '@coreui/icons-react'
import { cilCheckAlt, cilPencil, cilX, cilWarning, cilTag } from '@coreui/icons'

import { getProductos } from '../../actions/productosAction'

const TablaProductos = () => {
  const dispatch = useDispatch()
  const { productos, paginaActual, ultimaPagina, totalProductos } = useSelector(
    (state) => state.productos,
  )

  const { theme } = useSelector((state) => state.layout)
  const { loading } = useSelector((state) => state.ui)

  const openModal = (producto) => {
    dispatch(setProducto(producto))
    dispatch(
      uiOpenModal(
        <span>
          <CIcon icon={cilPencil} /> Editar Producto
        </span>,
        'Guardar Cambios',
        'modificar',
      ),
    )
  }

  const openModalEtiqueta = (producto) => {
    dispatch(setProducto(producto))
    dispatch(
      uiOpenProductoEtiquetaModal(
        <span>
          <CIcon icon={cilTag} /> Etiqueta
        </span>,
        'Guardar Imagen',
        'modificar',
      ),
    )
  }

  const toggleAlert = (tipo, producto) => {
    dispatch(setProducto(producto))
    dispatch(
      uiOpenProductosDialog(
        <span>
          <CIcon icon={cilWarning} /> Confirmación
        </span>,
        <span>
          Está seguro que quiere cambiar el producto a estado <strong>{tipo}</strong>?
        </span>,
        'Si',
        'No',
        tipo,
      ),
    )
  }

  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 5,
  })

  const paginas = []
  for (let i = 1; i <= ultimaPagina; i++) {
    paginas.push({ value: i, label: i })
  }

  useEffect(() => {
    dispatch(getProductos('', {}, pagination.pageIndex, pagination.pageSize))
  }, [dispatch, pagination])

  const columns = useMemo(
    () => [
      {
        accessorKey: 'code',
        header: 'CÓDIGO',
        cell: ({ row }) => <span>{`${row.original.code}`}</span>,
      },
      {
        accessorKey: 'nombre',
        header: 'NOMBRE',
        cell: ({ row }) => <span>{`${row.original.name}`}</span>,
      },
      {
        accessorKey: 'description',
        header: 'DESCRIPCIÓN',
        cell: ({ row }) => <span>{`${row.original.description}`}</span>,
      },
      {
        accessorKey: 'categories',
        header: 'CATEGORIAS',
        cell: ({ row }) => (
          <span>
            {row.original.categories.map((category, i) => (
              <CBadge className="mr-1" key={i} color="primary">
                {category.label}
              </CBadge>
            ))}
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
        filterFn: 'equals',
      },
      {
        accessorKey: 'acciones',
        header: 'ACCIONES',
        cell: ({ row }) => (
          <span className="py-2">
            {row.original.deleted_at === null ? (
              <>
                <CButton
                  color="primary"
                  variant="outline"
                  shape="square"
                  onClick={() => {
                    openModal(row.original)
                  }}
                >
                  <CIcon icon={cilPencil} />
                </CButton>{' '}
                <CButton
                  color="primary"
                  variant="outline"
                  shape="square"
                  onClick={() => {
                    openModalEtiqueta(row.original)
                  }}
                >
                  <CIcon icon={cilTag} />
                </CButton>{' '}
                <CButton
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
          </span>
        ),
      },
    ],
    [dispatch],
  )

  const table = useReactTable({
    data: productos,
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
          <span className="pt-1 mx-2">{`${totalProductos} registros`}</span>
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

export default TablaProductos
