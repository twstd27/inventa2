import {
  CButton,
  CCol,
  // CDataTable,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
} from '@coreui/react'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { uiCloseModal } from '../../actions/uiAction'
import { format } from 'date-fns'
// import moment from "moment";
import { NumeroLiteral } from '../../helpers/global'

import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table'

export const ModalCotizaciones = (props) => {
  const dispatch = useDispatch()
  const { modalCotizacionesOpen, modalTitle } = useSelector((state) => state.ui)
  const { cotizacion } = useSelector((state) => state.cotizaciones)

  // Definir las columnas
  const columns = React.useMemo(
    () => [
      {
        accessorKey: 'product',
        header: 'Producto',
        cell: ({ row }) => <td>{row.original.product.code + ' - ' + row.original.product.name}</td>,
      },
      {
        accessorKey: 'total',
        header: 'Total',
        cell: ({ row }) => (
          <td className="text-right font-weight-bold">
            {(row.original.price * row.original.quantity).toFixed(2)}
          </td>
        ),
      },
    ],
    [],
  )

  // Usar el hook `useTable`
  const table = useReactTable({
    data: cotizacion.quotation_details,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  // const fields = [
  //   { key: 'product', label: 'Producto', _style: { width: '35%' } },
  //   { key: 'quantity', label: 'Cantidad', _style: { width: '15%' } },
  //   { key: 'price', label: 'Precio/U', _style: { width: '15%' } },
  //   { key: 'total', label: 'Subtotal', _style: { width: '25%' }, _classes: 'text-right' },
  // ]

  const CloseModal = () => {
    dispatch(uiCloseModal())
  }

  return (
    <CModal
      show={modalCotizacionesOpen}
      onClose={CloseModal}
      color="primary"
      closeOnBackdrop={false}
    >
      <CModalHeader closeButton className="d-print-none">
        <CModalTitle>{modalTitle}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CRow className="d-print-block custom-font-print">
          <CCol xs="12">
            <table className="table w-100 table-sm table-borderless">
              <tbody>
                <tr>
                  <td>
                    <b>Fecha:</b>{' '}
                    {cotizacion.doc_date == '' ? '-' : format(cotizacion.doc_date, 'DD/MM/YYYY')}
                  </td>
                  <td>
                    <b>Horas:</b>{' '}
                    {cotizacion.doc_date == '' ? '-' : format(cotizacion.doc_date, 'H:mm:ss')}
                  </td>
                </tr>
                <tr>
                  <td>
                    <b>Sucursal:</b> {cotizacion.branch?.name}
                  </td>
                  <td>
                    <b>Cajero:</b> {cotizacion.user?.name} {cotizacion.user?.lastname}
                  </td>
                </tr>
                <tr>
                  <td colSpan="2">
                    <b>Razón Social:</b> {cotizacion?.customer}
                  </td>
                </tr>
              </tbody>
            </table>
          </CCol>
          <CCol xs="12">
            <table className="table table-bordered table-sm">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {/* <CDataTable
              items={cotizacion.quotation_details}
              fields={fields}
              size="sm"
              striped
              noItemsViewSlot={
                <h6 className="text-center text-muted">No se agregaron productos</h6>
              }
              scopedSlots={{
                product: (item) => <td>{item.product.code + ' - ' + item.product.name}</td>,
                total: (item) => (
                  <td className="text-right font-weight-bold">
                    {(item.price * 1 * (item.quantity * 1)).toFixed(2)}
                  </td>
                ),
              }}
            /> */}
          </CCol>
          <CCol xs="12">
            <table className="table w-100 table-sm table-borderless">
              <tbody>
                <tr className="text-right">
                  <td width="75%">
                    <b>TOTAL Bs.:</b>
                  </td>
                  <td width="25%">
                    <b>{cotizacion.doc_total}</b>
                  </td>
                </tr>
                <tr className="text-right">
                  <td colSpan={2}>
                    <b>son:</b> {NumeroLiteral(cotizacion.doc_total)}
                  </td>
                </tr>
              </tbody>
            </table>
          </CCol>
        </CRow>
      </CModalBody>
      <CModalFooter className="d-print-none">
        {props.f1 !== null && (
          <CButton
            color="primary"
            onClick={() => {
              props.f1(cotizacion)
            }}
          >
            <i className="fa fa-files-o" /> Copiar a Venta
          </CButton>
        )}
        <a
          href={`#/impresion/cotizacion?id=${cotizacion.id}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <CButton color="primary">
            <i className="fa fa-print" /> Imprimir
          </CButton>
        </a>
        <CButton color="secondary" onClick={CloseModal}>
          Cerrar
        </CButton>
      </CModalFooter>
    </CModal>
  )
}
