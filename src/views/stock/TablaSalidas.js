import React from 'react'
import { colorBadge } from '../../helpers/global'
import {
  // CDataTable,
  CBadge,
  CButton,
} from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import { uiOpenDialog } from '../../actions/uiAction'
// import {uiOpenModal} from "../../actions/uiAction";
import { setEntrada } from '../../actions/stockAction'

const TablaSalidas = () => {
  const dispatch = useDispatch()
  const { salidas } = useSelector((state) => state.stock)
  const fields = [
    { key: 'id', label: '#', _style: { width: '10%' } },
    { key: 'branch', label: 'Sucursal', _style: { width: '15%' } },
    { key: 'entry_details', label: 'Productos', _style: { width: '25%' } },
    { key: 'doc_date_format', label: 'Fecha', _style: { width: '10%' } },
    { key: 'comments', label: 'Comentarios', _style: { width: '15%' } },
    { key: 'deleted_at', label: 'Estado', _style: { width: '10%' } },
    {
      key: 'acciones',
      label: 'Acciones',
      _style: { width: '15%' },
      sorter: false,
      filter: false,
    },
  ]

  // const openModal= (entrada) =>{
  //   dispatch(setEntrada(entrada));
  //   dispatch(uiOpenModal(
  //     <span><i className="fa fa-pencil"/> Editar salida de inventario</span>,
  //     'Guardar Cambios',
  //     {
  //       action: 'modificar',
  //       type: 'salida'
  //     })
  //   );
  // }

  const toggleAlert = (accion, entrada) => {
    dispatch(setEntrada(entrada))
    dispatch(
      uiOpenDialog(
        <span>
          <i className="fa fa-exclamation-triangle" /> Confirmación
        </span>,
        <span>
          Está seguro que quiere cambiar la salida de inventario a estado <strong>{accion}</strong>?
        </span>,
        'Si',
        'No',
        accion,
      ),
    )
  }

  return (
    <CDataTable
      items={salidas}
      fields={fields}
      tableFilter
      itemsPerPageSelect
      itemsPerPage={5}
      hover
      border
      sorter
      noItemsViewSlot={<h5 className="text-center text-muted">No se encontraron registros</h5>}
      pagination
      scopedSlots={{
        branch: (item) => <td>{item.branch?.name}</td>,
        entry_details: (item) => (
          <td>
            {item.entry_details?.map((entryDetail, i) => (
              <CBadge className="mr-1" key={i} color="primary">
                {entryDetail.product.name}
              </CBadge>
            ))}
          </td>
        ),
        comments: (item) => <td>{item.comments === null ? '' : item.comments}</td>,
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
              {item.deleted_at === null ? (
                <>
                  {/*<CButton*/}
                  {/*  color="primary"*/}
                  {/*  variant="outline"*/}
                  {/*  shape="square"*/}
                  {/*  onClick={()=>{openModal(item)}}*/}
                  {/*>*/}
                  {/*  <i className="fa fa-pencil font-lg"/>*/}
                  {/*</CButton>{' '}*/}
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
                </>
              ) : (
                <CButton
                  color="success"
                  variant="outline"
                  shape="square"
                  onClick={() => {
                    toggleAlert('activo', item)
                  }}
                >
                  <i className="fa fa-check font-lg" />
                </CButton>
              )}
            </td>
          )
        },
      }}
    />
  )
}

export default TablaSalidas
