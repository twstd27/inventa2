import React from 'react'
import { colorBadge } from '../../helpers/global'
import { CDataTable, CBadge, CButton, CTooltip } from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import { uiOpenVentasDialog, uiOpenVentasModal } from '../../actions/uiAction'
import { setVenta } from '../../actions/ventasAction'
import { format } from 'date-fns'

const TablaVentas = () => {
  const dispatch = useDispatch()
  const { ventas } = useSelector((state) => state.ventas)
  const fields = [
    { key: 'id', label: '#', _style: { width: '10%' } },
    { key: 'doc_total', label: 'Total Venta', _style: { width: '15%' } },
    { key: 'doc_date', label: 'Fecha', _style: { width: '15%' } },
    { key: 'invoice', label: 'Factura', _style: { width: '10%' } },
    { key: 'comments', label: 'Comentarios', _style: { width: '20%' } },
    { key: 'deleted_at', label: 'Estado', _style: { width: '10%' } },
    {
      key: 'acciones',
      label: 'Acciones',
      _style: { width: '20%' },
      sorter: false,
      filter: false,
    },
  ]

  const openModal = (producto) => {
    dispatch(setVenta(producto))
    dispatch(
      uiOpenVentasModal(
        <span>
          <i className="fa fa-eye" /> Detalle de Venta
        </span>,
        '',
        'crear',
      ),
    )
  }

  const toggleAlert = (tipo, venta) => {
    dispatch(setVenta(venta))
    dispatch(
      uiOpenVentasDialog(
        <span>
          <i className="fa fa-exclamation-triangle" /> Confirmación
        </span>,
        <span>
          Está seguro que quiere <b>eliminar</b> la venta? (esta acción no se puede deshacer)
        </span>,
        'Si',
        'No',
        tipo,
      ),
    )
  }

  return (
    <CDataTable
      items={ventas}
      fields={fields}
      tableFilter
      itemsPerPageSelect
      itemsPerPage={10}
      hover
      border
      sorter
      size="sm"
      noItemsViewSlot={<h5 className="text-center text-muted">No se encontraron registros</h5>}
      pagination
      scopedSlots={{
        doc_date: (item) => (
          <td>
            {format(item.created_at, 'DD/MM/YYYY')}
            <br />
            {format(item.created_at, 'h:mm:ss a')}
          </td>
        ),
        invoice: (item) => (
          <td>
            {item.invoice ? (
              <>
                <span className={'pr-1'}>si</span>
                <CTooltip
                  content={`${item.invoice_number || ''} | ${item.customer_number || ''} | ${item.customer || ''}`}
                >
                  <span>
                    <i className="fa fa-info-circle" />
                  </span>
                </CTooltip>
              </>
            ) : (
              'no'
            )}
          </td>
        ),
        comments: (item) => (
          <td>
            {/*{((item.comments === null) ? '' : item.comments)}*/}
            {item.comments || ''}
          </td>
        ),
        deleted_at: (item) => (
          <td>
            <CBadge color={colorBadge(item.deleted_at === null ? 1 : 0)}>
              {item.deleted_at === null ? 'activo' : 'inactivo'}
            </CBadge>
          </td>
        ),
        acciones: (item) => {
          return (
            <td className="py-2">
              <CButton
                color="primary"
                variant="outline"
                shape="square"
                onClick={() => {
                  openModal(item)
                }}
              >
                <i className="fa fa-eye font-lg" />
              </CButton>{' '}
              {item.deleted_at === null && (
                <CButton
                  color="danger"
                  variant="outline"
                  shape="square"
                  onClick={() => {
                    toggleAlert('inactivo', item)
                  }}
                >
                  <i className="fa fa-times font-lg" />
                </CButton>
              )}
            </td>
          )
        },
      }}
    />
  )
}

export default TablaVentas
