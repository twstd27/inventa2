import React from 'react';
import {colorBadge} from "../../helpers/global";
import {
  CDataTable,
  CBadge,
  CButton,
} from '@coreui/react';
import {useDispatch, useSelector} from "react-redux";
import {uiOpenDialog, uiOpenModal} from "../../actions/uiAction";
import {setRol} from "../../actions/rolesAction";

const TablaRoles = () => {
  const dispatch = useDispatch();
  const {roles} = useSelector(state => state.roles);
  const fields = [
    { key: 'name', label: 'Nombre', _style: { width: '30%'} },
    { key: 'permissions', label: 'Permisos', _style: { width: '30%'} },
    { key: 'deleted_at', label: 'Estado', _style: { width: '20%'} },
    {
      key: 'acciones',
      label: 'Acciones',
      _style: { width: '20%' },
      sorter: false,
      filter: false
    }
  ];

  const openModal= (rol) =>{
    dispatch(setRol(rol));
    dispatch(uiOpenModal(
      <span><i className="fa fa-pencil"/> Editar Rol</span>,
      'Guardar Cambios',
      'modificar')
    );
  }

  const toggleAlert = (tipo, rol) => {
    dispatch(setRol(rol));
    dispatch(uiOpenDialog(
      <span><i className='fa fa-exclamation-triangle' /> Confirmación</span>,
      <span>Está seguro que quiere cambiar el rol a estado <strong>{tipo}</strong>?</span>,
      'Si',
      'No',
      tipo)
    );
  }

  return (
    <CDataTable
      items={roles}
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
        'permissions':
          (item)=>(
            <td>
              {
                item.permissions.map( (permission, i) => (
                  <CBadge className="mr-1" key={i} color="primary">{permission.label}</CBadge>
                ))
              }
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

export default TablaRoles
