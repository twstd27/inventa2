import React from 'react';
import {colorBadge} from "../../helpers/global";
import {
  CDataTable,
  CBadge,
  CButton,
} from '@coreui/react';
import {useDispatch, useSelector} from "react-redux";
import {uiOpenDialog, uiOpenModal} from "../../actions/uiAction";
import {setMarca} from "../../actions/marcasActions";

const TablaMarcas = () => {
  const dispatch = useDispatch();
  const {marcas} = useSelector(state => state.marcas);
  const fields = [
    { key: 'name', label: 'Nombre', _style: { width: '28%'} },
    { key: 'description', label: 'Descripción', _style: { width: '28%'} },
    { key: 'deleted_at', label: 'Estado', _style: { width: '28%'} },
    {
      key: 'acciones',
      label: 'Acciones',
      _style: { width: '16%' },
      sorter: false,
      filter: false
    }
  ];

  const openModal= (marca) =>{
    dispatch(setMarca(marca));
    dispatch(uiOpenModal(
      <span><i className="fa fa-pencil"/> Editar Marca</span>,
      'Guardar Cambios',
      'modificar')
    );
  }

  const toggleAlert = (tipo, marca) => {
    dispatch(setMarca(marca));
    dispatch(uiOpenDialog(
      <span><i className='fa fa-exclamation-triangle' /> Confirmación</span>,
      <span>Está seguro que quiere cambiar la marca a estado <strong>{tipo}</strong>?</span>,
      'Si',
      'No',
      tipo)
    );
  }

  return (
    <CDataTable
      items={marcas}
      fields={fields}
      tableFilter
      itemsPerPageSelect
      itemsPerPage={5}
      hover
      border
      sorter
      noItemsViewSlot={<h5 className="text-center text-muted">No se encontraron registros</h5>}
      pagination
      scopedSlots = {{
        'description':
          (item)=>(
            <td>
                {((item.description === null) ? '' : item.description)}
            </td>
          ),
        'deleted_at':
          (item)=>(
            <td>
              <CBadge color={colorBadge(((item.deleted_at === null) ? 1 : 0))}>
                {((item.deleted_at === null) ? 'activo' : 'inactivo')}
              </CBadge>
            </td>
          ),
        'acciones':
          (item)=>{
            return (
              <td className="py-2">
                {
                  item.deleted_at === null ? (
                    <>
                      <CButton
                        color="primary"
                        variant="outline"
                        shape="square"
                        onClick={()=>{openModal(item)}}
                      >
                        <i className="fa fa-pencil font-lg"/>
                      </CButton>{' '}
                      <CButton
                        color="danger"
                        variant="outline"
                        shape="square"
                        onClick={()=>{toggleAlert('inactivo', item)}}
                      >
                        <i className="fa fa-times font-lg"/>
                      </CButton>
                    </>
                  ) :
                  (
                    <CButton
                      color="success"
                      variant="outline"
                      shape="square"
                      onClick={()=>{toggleAlert('activo', item)}}
                    >
                      <i className="fa fa-check font-lg"/>
                    </CButton>
                  )
                }
              </td>
            )
          },
      }}
    />
  )
}

export default TablaMarcas
