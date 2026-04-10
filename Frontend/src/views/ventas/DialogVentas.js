import { useState, useCallback, useMemo } from 'react'
import {
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CCol,
  CFormTextarea,
  CFormInput,
  CCollapse,
  CFormSwitch,
} from '@coreui/react'
import { useUIStore } from '../../stores/useUIStore'
import { useVentasStore } from '../../stores/useVentasStore'
import { format } from 'date-fns'
import { NumeroLiteral } from '../../helpers/global'
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table'
import { Printer } from 'lucide-react'

export const DialogVentas = (props) => {
  const {
    dialogVentasOpen,
    dialogTitle,
    dialogBody,
    dialogButtonOk,
    dialogButtonCancel,
    dialogAction,
    venta,
    closeDialog,
  } = useUIStore()
  const loading = useUIStore((s) => s.loadingCount > 0)
  const { venta: ventaModal, deleteSale } = useVentasStore()

  const [datosFactura, setDatosFactura] = useState(false)
  const [detallesVenta, setDetallesVenta] = useState({
    comentarios: '',
    factura: '',
    nit: '',
    razonSocial: '',
  })

  // console.log(venta)

  const handleClick = () => {
    switch (dialogAction) {
      case 'crear':
        const nuevaVenta = {
          branch_id: venta.branch_id,
          doc_date: venta.doc_date,
          doc_total: venta.doc_total,
          lineas: venta.lineas,
          user_id: venta.user_id,
          comments: detallesVenta.comentarios,
          invoice_number: detallesVenta.factura,
          customer: detallesVenta.razonSocial,
          customer_number: detallesVenta.nit,
          invoice: datosFactura,
        }
        props.f1(nuevaVenta)
        break
      case 'inactivo':
        deleteSale(ventaModal)
        break
      default:
        break
    }
  }

  const handleInputChange = ({ target }) => {
    const { name, value } = target
    setDetallesVenta((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleSwitch = () => {
    setDatosFactura(!datosFactura)
  }

  const data = useMemo(() => {
    return venta && venta.lineas ? JSON.parse(venta.lineas) : []
  }, [venta])

  const columns = useMemo(
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
        header: 'Total',
        cell: ({ row }) => (
          <span className="text-right font-weight-bold">
            {(row.original.price * row.original.quantity).toFixed(2)}
          </span>
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

  return dialogAction === 'crear' ? (
    <CModal visible={dialogVentasOpen} onClose={closeDialog} size="lg">
      <CModalHeader closeButton className="d-print-none bg-primary text-white">
        <CModalTitle>{dialogTitle}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CRow className="print-div-ticket custom-font-print ">
          <CCol xs="12" className="d-flex flex-column gap-3">
            <div>
              <CFormTextarea
                name="comentarios"
                value={detallesVenta.comentarios}
                onChange={handleInputChange}
                floatingLabel="Comentarios"
                className="w-100"
              ></CFormTextarea>
            </div>
            <CFormSwitch
              label="Llenar factura"
              id="sw_factura"
              checked={datosFactura}
              onChange={handleSwitch}
            />
            <CCollapse visible={datosFactura} className="pb-3">
              <CRow className="g-1">
                <CCol xs="4">
                  <CFormInput
                    name="factura"
                    value={detallesVenta.factura}
                    onChange={handleInputChange}
                    floatingLabel="Nro. Factura"
                  />
                </CCol>
                <CCol xs="4">
                  <CFormInput
                    name="nit"
                    value={detallesVenta.nit}
                    onChange={handleInputChange}
                    floatingLabel="NIT"
                  />
                </CCol>
                <CCol xs="4">
                  <CFormInput
                    name="razonSocial"
                    value={detallesVenta.razonSocial}
                    onChange={handleInputChange}
                    floatingLabel="Razón Social"
                  />
                </CCol>
              </CRow>
            </CCollapse>
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
        <CButton onClick={handleClick} disabled={loading} color="primary">
          {dialogButtonOk}
        </CButton>
        {/* <CButton
          color="primary"
          onClick={() => {
            window.print()
          }}
        >
          <Printer size={16} className="ml-2" /> Imprimir
        </CButton> */}
        <CButton color="secondary" onClick={closeDialog}>
          Cerrar
        </CButton>
      </CModalFooter>
    </CModal>
  ) : (
    <CModal visible={dialogVentasOpen} onClose={closeDialog} color="primary" size="sm">
      <CModalHeader closeButton>
        <CModalTitle>{dialogTitle}</CModalTitle>
      </CModalHeader>
      <CModalBody>{dialogBody}</CModalBody>
      <CModalFooter>
        <CButton onClick={handleClick} disabled={loading} color="primary">
          {dialogButtonOk}
        </CButton>
        <CButton color="secondary" onClick={closeDialog}>
          {dialogButtonCancel}
        </CButton>
      </CModalFooter>
    </CModal>
  )
}
