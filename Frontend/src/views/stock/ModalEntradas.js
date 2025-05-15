import React, { useEffect, useState } from 'react'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from '@tanstack/react-table'
import {
  CAlert,
  CButton,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CFormTextarea,
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
import Select from 'react-select'
import { useDispatch, useSelector } from 'react-redux'
import { uiCloseModal } from '../../actions/uiAction'
import { modifyEntry, registerEntry } from '../../actions/stockAction'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilX, cilTrash, cilPlus } from '@coreui/icons'
import { SelectStyles } from '../../helpers/global'

export const ModalEntradas = () => {
  const dispatch = useDispatch()
  const { usuario } = useSelector((state) => state.auth)

  const { theme } = useSelector((state) => state.layout)
  const selectStyles = SelectStyles(theme)

  const { modalOpen, modalTitle, modalButton, modalAction, loading } = useSelector(
    (state) => state.ui,
  )
  const { entrada, error: errorForm } = useSelector((state) => state.stock)
  const { sucursalesCombo } = useSelector((state) => state.sucursales)
  const { productosCombo } = useSelector((state) => state.productos)
  const [formValues, setFormValues] = useState(entrada)
  const [sucursalEntrada, setSucursalEntrada] = useState(null)
  const [productoEntrada, setProductoEntrada] = useState(null)
  const [detalles, setDetalles] = useState([])
  const [state, setState] = useState({
    quantity: '',
    cost: '',
    errBranch: false,
    errType: false,
    errDocDate: false,
    errDetails: '',
    errProduct: '',
    errQuantity: false,
    errCost: false,
    btnAdd: true,
    btnEdit: false,
  })

  useEffect(() => {
    if (entrada) {
      setFormValues(entrada)
      setSucursalEntrada({
        value: entrada.branch.id || '',
        label: entrada.branch.name || '',
      })
      setDetalles(entrada.entry_details)
      setState({
        quantity: '',
        cost: '',
        errBranch: false,
        errType: false,
        errDocDate: false,
        errDetails: '',
        errProduct: '',
        errQuantity: false,
        errCost: false,
        btnAdd: true,
        btnEdit: false,
        positio: -1,
      })
    }
  }, [entrada, setFormValues])

  const handleInputChange = ({ target }) => {
    setFormValues({
      ...formValues,
      [target.name]: target.value,
    })
  }

  const handleStateChange = ({ target }) => {
    setState({
      ...state,
      [target.name]: target.value,
    })
  }

  const {
    quantity,
    cost,
    errBranch,
    errType,
    errDocDate,
    errDetails,
    errProduct,
    errQuantity,
    errCost,
    btnAdd,
    btnEdit,
    position,
  } = state

  const handleSelectChangeBranch = (values) => {
    setSucursalEntrada(values)
  }

  const handleSelectChangeProduct = (values) => {
    setProductoEntrada(values)
    setState({
      ...state,
      cost: values.cost,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isFormValid()) {
      if (modalAction.action === 'crear') {
        dispatch(
          registerEntry({
            branch_id: sucursalEntrada.value,
            type: modalAction.type,
            doc_date,
            comments,
            user_id: usuario.id,
            detalles: JSON.stringify(detalles),
          }),
        )
      } else {
        dispatch(
          modifyEntry({
            id,
            branch_id: sucursalEntrada.value,
            type: modalAction.type,
            doc_date,
            comments,
            detalles: JSON.stringify(detalles),
            borrar: JSON.stringify(entrada.entry_details),
          }),
        )
      }
    }
  }

  const isFormValid = () => {
    let valid = true
    let invalid = {
      branch: false,
      type: false,
      docDate: false,
      details: '',
    }

    if (sucursalEntrada === null || sucursalEntrada === undefined) {
      invalid.branch = 'este campo no puede estar vacío'
      valid = false
    } else {
      if (sucursalEntrada.value === '') {
        invalid.branch = 'este campo no puede estar vacío'
        valid = false
      }
    }
    if (modalAction?.type.trim().length === 0) {
      invalid.type = true
      valid = false
    }
    if (doc_date === undefined) {
      invalid.docDate = true
      valid = false
    }
    if (detalles.length === 0) {
      invalid.details = 'debe existir por lo menos 1 producto agregado'
      valid = false
    }

    setState({
      ...state,
      errBranch: invalid.branch,
      errType: invalid.type,
      errDocDate: invalid.docDate,
      errDetails: invalid.details,
      errProduct: '',
      errQuantity: false,
      errCost: false,
    })

    return valid
  }

  const isAddProductValid = () => {
    let valid = {
      form: true,
      product: '',
      quantity: false,
      cost: false,
    }
    if (productoEntrada === null || productoEntrada === undefined) {
      valid.product = 'este campo no puede estar vacío'
      valid.form = false
    } else {
      if (productoEntrada.value === '') {
        valid.product = 'este campo no puede estar vacío'
        valid.form = false
      }
    }

    if (quantity.trim().length === 0 || quantity * 1 === 0) {
      valid.quantity = true
      valid.form = false
    }
    if (cost.trim().length === 0) {
      valid.cost = true
      valid.form = false
    }

    setState({
      ...state,
      errProduct: valid.product,
      errQuantity: valid.quantity,
      errCost: valid.cost,
      errDetails: '',
    })

    return valid.form
  }

  const handleClickAdd = (type) => {
    if (isAddProductValid()) {
      const parts = productoEntrada.label.split(' - ')
      const product = {
        quantity,
        cost,
        product: {
          id: productoEntrada.value,
          code: parts[0],
          name: parts[1],
        },
      }
      if (type === 'add') {
        setDetalles([product, ...detalles])
      } else {
        let aux = detalles
        aux[position] = product
        setDetalles(aux)
      }
      resetAddProduct()
    }
  }

  const handleClickEdit = (x) => {
    setState({
      ...state,
      quantity: detalles[x].quantity,
      cost: detalles[x].cost,
      errProduct: '',
      errQuantity: false,
      errCost: false,
      btnAdd: false,
      btnEdit: true,
      position: x,
    })
    setProductoEntrada({
      value: detalles[x].product.id,
      label: detalles[x].product.code + ' - ' + detalles[x].product.name,
    })
  }

  const handleClickRemove = (x) => {
    const aux = detalles.filter((img, i) => i !== x)
    setDetalles(aux)
  }

  const resetAddProduct = () => {
    setState({
      ...state,
      quantity: '',
      cost: '',
      errProduct: '',
      errQuantity: false,
      errCost: false,
      btnAdd: true,
      btnEdit: false,
      position: -1,
    })
    setProductoEntrada(null)
  }

  // TODO: modificar funcion para guardar y modificar la entrada

  const { id, doc_date, comments } = formValues

  const CloseModal = () => {
    dispatch(uiCloseModal())
  }

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  })

  const paginas = []
  for (let i = 1; i <= Math.ceil(detalles.length / pagination.pageSize); i++) {
    paginas.push({ value: i, label: i })
  }

  const columns = [
    {
      accessorKey: 'product',
      header: 'Producto',
      cell: ({ row }) => (
        <span>{`${row.original.product.code} - ${row.original.product.name}`}</span>
      ),
      size: 200,
    },
    {
      accessorKey: 'quantity',
      header: 'Cantidad',
      size: 100,
    },
    {
      accessorKey: 'cost',
      header: 'Costo',
      size: 100,
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <CButton
            color="primary"
            variant="outline"
            shape="square"
            onClick={() => handleClickEdit(row.index)}
          >
            <CIcon icon={cilPencil} />
          </CButton>{' '}
          <CButton
            color="danger"
            variant="outline"
            shape="square"
            onClick={() => handleClickRemove(row.index)}
          >
            <CIcon icon={cilTrash} />
          </CButton>
        </div>
      ),
      size: 120,
      meta: {
        align: 'center', // This can be used for custom styling
      },
    },
  ]

  const table = useReactTable({
    data: detalles,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination,
    },
  })

  return (
    <CModal visible={modalOpen} onClose={CloseModal} size="lg">
      <CForm onSubmit={handleSubmit}>
        <CModalHeader closeButton className="bg-primary text-white">
          <CModalTitle>{modalTitle}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow>
            <CCol md="12">
              {errorForm !== undefined && errorForm?.message !== '' && (
                <CAlert color="danger">
                  {errorForm.message}
                  {errorForm.errors.length !== 0 && (
                    <ul>
                      {errorForm.errors.map((error, i) => (
                        <li key={i}>{error}</li>
                      ))}
                    </ul>
                  )}
                </CAlert>
              )}
            </CCol>
          </CRow>
          <CRow>
            <CCol md="6">
              <CFormLabel htmlFor="branch">Sucursal</CFormLabel>
              <Select
                value={sucursalEntrada}
                styles={selectStyles}
                onChange={handleSelectChangeBranch}
                options={sucursalesCombo}
                name="branch"
              />
              <span className="text-danger small">{errBranch}</span>
            </CCol>
            <CCol md="6">
              <CFormInput
                type="text"
                label="Tipo"
                name="type"
                readOnly={true}
                value={modalAction.type || ''}
                onChange={handleInputChange}
                feedback="este campo no puede estar vacío"
                invalid={errType}
              />
            </CCol>
          </CRow>
          <CRow>
            <CCol md="6">
              <CFormInput
                type="date"
                label="Fecha"
                name="doc_date"
                value={doc_date || ''}
                onChange={handleInputChange}
                invalid={errDocDate}
                feedback="este campo no puede estar vacío"
              />
            </CCol>
            <CCol md="6">
              <CFormTextarea
                label="Comentarios"
                value={comments === null ? '' : comments}
                onChange={handleInputChange}
                name="comments"
                rows="2"
              />
            </CCol>
          </CRow>
          <CRow>
            <CCol md="12" className="separator" />
          </CRow>
          <CRow>
            <CCol md="6">
              <CFormLabel htmlFor="product">Producto</CFormLabel>
              <Select
                value={productoEntrada}
                onChange={handleSelectChangeProduct}
                options={productosCombo}
                name="product"
                styles={selectStyles}
              />
              <span className="text-danger small">{errProduct}</span>
            </CCol>
            <CCol md="2">
              <CFormInput
                type="number"
                label="Cantidad"
                name="quantity"
                value={quantity}
                onChange={handleStateChange}
                invalid={errQuantity}
                feedback="este campo no puede estar vacío o tener valor 0"
              />
            </CCol>
            <CCol md="2">
              <CFormInput
                type="number"
                label="Costo"
                name="cost"
                value={cost}
                onChange={handleStateChange}
                invalid={errCost}
                feedback="este campo no puede estar vacío"
              />
            </CCol>
            <CCol md="2">
              <br />
              {btnAdd && (
                <CButton
                  className="ml-1 mt-2 w-full"
                  color="primary"
                  onClick={() => {
                    handleClickAdd('add')
                  }}
                >
                  <CIcon icon={cilPlus} />
                </CButton>
              )}
              {btnEdit && (
                <div className="d-flex justify-content-around">
                  <CButton
                    className="ml-1 mt-2"
                    color="primary"
                    onClick={() => {
                      handleClickAdd('edit')
                    }}
                  >
                    <CIcon icon={cilPencil} />
                  </CButton>
                  <CButton className="ml-1 mt-2" color="secondary" onClick={resetAddProduct}>
                    <CIcon icon={cilX} />
                  </CButton>
                </div>
              )}
            </CCol>
          </CRow>
          <CRow>
            <CCol md="12" className="pt-2">
              <span className="text-danger small">{errDetails}</span>
              <CTable hover bordered responsive small>
                <CTableHead className="table-header-color">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <CTableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <CTableHeaderCell
                          key={header.id}
                          style={{ width: `${header.getSize()}px` }}
                          className="table-header-color"
                        >
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
                <CPaginationItem
                  onClick={() => table.firstPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  {'<<'}
                </CPaginationItem>
                <CPaginationItem
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  {'<'}
                </CPaginationItem>
                <CPaginationItem
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  {'>'}
                </CPaginationItem>
                <CPaginationItem
                  onClick={() => table.lastPage()}
                  disabled={!table.getCanNextPage()}
                >
                  {'>>'}
                </CPaginationItem>
                <div className="w-100 d-flex justify-content-between">
                  <span className="pt-1 mx-2">{`Página ${pagination.pageIndex + 1} de ${Math.ceil(detalles.length / pagination.pageSize)}`}</span>
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
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton type="submit" color="primary" disabled={loading}>
            {loading && (
              <>
                <div className="spinner-border text-light spinner-border-sm" role="status">
                  <span className="visually-hidden">cargando...</span>
                </div>
              </>
            )}
            {!loading && <span> {modalButton}</span>}
          </CButton>{' '}
          <CButton color="secondary" onClick={CloseModal}>
            Cancelar
          </CButton>
        </CModalFooter>
      </CForm>
    </CModal>
  )
}
