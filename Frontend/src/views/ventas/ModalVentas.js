import {
  CButton,
  CCol,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
} from '@coreui/react'
import React, { useRef } from 'react'
import { useUIStore } from '../../stores/useUIStore'
import { useVentasStore } from '../../stores/useVentasStore'
import { format } from 'date-fns'
import { NumeroLiteral, SerialNumber } from '../../helpers/global'

import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table'
import { Printer } from 'lucide-react'
import { useReactToPrint } from 'react-to-print'

export const ModalVentas = () => {
  const { modalVentasOpen, modalTitle, closeModal } = useUIStore()
  const { venta } = useVentasStore()

  const componentRef = useRef(null)

  const data = venta?.sale_details || []

  const columns = React.useMemo(
    () => [
      {
        accessorKey: 'product',
        header: 'Producto',
        cell: ({ row }) => (
          <span>{row.original.product.code + ' - ' + row.original.product.name}</span>
        ),
      },
      {
        accessorKey: 'quantity',
        header: 'Cantidad',
      },
      {
        accessorKey: 'price',
        header: 'Precio',
      },
      {
        accessorKey: 'total',
        header: 'SubTotal',
        cell: ({ row }) => (
          <span className="text-right font-weight-bold">
            {(row.original.price * row.original.quantity).toFixed(2)}
          </span>
        ),
      },
    ],
    [],
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const CloseModal = () => {
    closeModal()
  }

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `venta_${venta.id || '0'}`,
  })

  return (
    <CModal visible={modalVentasOpen} onClose={CloseModal}>
      <CModalHeader closeButton className="d-print-none bg-primary text-white">
        <CModalTitle>{modalTitle}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CRow className="print-div-ticket custom-font-print" ref={componentRef}>
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
                    {venta.doc_date == '' ? '-' : format(venta.created_at, 'dd/MM/yyyy')}
                  </td>
                  <td>
                    <b>Horas:</b> {venta.doc_date == '' ? '-' : format(venta.created_at, 'H:mm:ss')}
                  </td>
                </tr>
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
        <CButton color="primary" onClick={handlePrint}>
          <Printer size={16} className="ml-2" /> Imprimir
        </CButton>
        <CButton color="secondary" onClick={CloseModal}>
          Cerrar
        </CButton>
      </CModalFooter>
    </CModal>
  )
}
