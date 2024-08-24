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
import { NumeroLiteral, SerialNumber } from '../../helpers/global'

import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table'

export const ModalVentas = () => {
  const dispatch = useDispatch()
  const { modalVentasOpen, modalTitle } = useSelector((state) => state.ui)
  const { venta } = useSelector((state) => state.ventas)

  const data = venta?.sale_details || [] // Usar un array vacío si está undefined

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
    data,
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
    <CModal show={modalVentasOpen} onClose={CloseModal} color="primary" closeOnBackdrop={false}>
      <CModalHeader closeButton className="d-print-none">
        <CModalTitle>{modalTitle}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CRow className="d-print-block custom-font-print">
          <CCol xs="12">
            <table className="table w-100 table-sm table-borderless">
              <tbody>
                <tr>
                  <td colSpan={2} className="text-right">
                    {SerialNumber(venta.id + '' || '0')}
                  </td>
                </tr>
                <tr>
                  <td>
                    <b>Fecha:</b>{' '}
                    {venta.doc_date == '' ? '-' : format(venta.doc_date, 'DD/MM/YYYY')}
                  </td>
                  <td>
                    <b>Horas:</b> {venta.doc_date == '' ? '-' : format(venta.doc_date, 'H:mm:ss')}
                  </td>
                </tr>
                {/*<tr>*/}
                {/*  <td><b>NIT:</b> ---</td>*/}
                {/*</tr>*/}
                {/*<tr>*/}
                {/*  <td><b>Señores:</b> ---</td>*/}
                {/*</tr>*/}
                <tr>
                  <td>
                    <b>Sucursal:</b> {venta.branch?.name}
                  </td>
                  <td>
                    <b>Cajero:</b> {venta.user?.name} {venta.user?.lastname}
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
              items={venta.sale_details}
              fields={fields}
              size="sm"
              border
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
                    <b>{venta.doc_total}</b>
                  </td>
                </tr>
                <tr className="text-right">
                  <td colSpan={2}>
                    <b>son:</b> {NumeroLiteral(venta.doc_total)}
                  </td>
                </tr>
              </tbody>
            </table>
          </CCol>
        </CRow>
      </CModalBody>
      <CModalFooter className="d-print-none">
        <CButton
          color="primary"
          onClick={() => {
            window.print()
          }}
        >
          <i className="fa fa-print" /> Imprimir
        </CButton>
        <CButton color="secondary" onClick={CloseModal}>
          Cerrar
        </CButton>
      </CModalFooter>
    </CModal>
  )
}
