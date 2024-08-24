import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CDataTable,
  CRow,
} from '@coreui/react'
import { NumeroLiteral, URLVariable } from '../../../helpers/global'
import { format } from 'date-fns'
import { getCotizacion } from '../../../actions/cotizacionesAction'

const VentaPrint = (props) => {
  const dispatch = useDispatch()
  const { cotizacionImp: cotizacion } = useSelector((state) => state.cotizaciones)

  useEffect(() => {
    let id = URLVariable(props, 'id')
    if (id !== null) {
      dispatch(getCotizacion(id, 'imp'))
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const fields = [
    { key: 'product', label: 'Producto', _style: { width: '35%' } },
    { key: 'quantity', label: 'Cantidad', _style: { width: '15%' } },
    { key: 'price', label: 'Precio', _style: { width: '15%' } },
    { key: 'total', label: 'Subtotal', _style: { width: '25%' }, _classes: 'text-right' },
  ]

  return (
    <>
      <CButton
        className="d-print-none m-5 float-right"
        size="lg"
        color="primary"
        onClick={() => {
          window.print()
        }}
      >
        <i className="fa fa-print" /> Imprimir
      </CButton>
      {/*<img className="" width="200" src="./logo.jpg" alt=""/>*/}
      <div className="c-app c-default-layout pt-membrete">
        <CContainer>
          <CRow className="justify-content-center">
            <CCol md="10">
              <CCardGroup>
                <CCard className="p-0 myDivToPrint border-white">
                  <CCardBody>
                    <h1 className="text-center">
                      {' '}
                      <u>COTIZACIÓN</u>{' '}
                    </h1>
                    <table className="table w-100 table-sm table-borderless">
                      <tbody>
                        <tr>
                          <td>
                            <b>Fecha:</b> {format(cotizacion.doc_date, 'DD/MM/YYYY')}
                          </td>
                          <td>
                            <b>Horas:</b> {format(cotizacion.doc_date, 'H:mm:ss')}
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
                    <CDataTable
                      items={cotizacion.quotation_details}
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
                    />
                    <CCol xs="12" className="px-0">
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
                  </CCardBody>
                </CCard>
              </CCardGroup>
            </CCol>
          </CRow>
        </CContainer>
      </div>
    </>
  )
}

export default VentaPrint
