import React from 'react';
import {colorBadge} from "../../helpers/global";
import {
  CDataTable,
  CBadge,
  CButton,
} from '@coreui/react';
import {useDispatch, useSelector} from "react-redux";
import {uiOpenModal, uiOpenProductoEtiquetaModal, uiOpenProductosDialog} from "../../actions/uiAction";
import {setProducto} from "../../actions/productosAction";

const TablaProductos = () => {
  const dispatch = useDispatch();
  const {productos} = useSelector(state => state.productos);
  const fields = [
    { key: 'code', label: 'Código', _style: { width: '15%'} },
    { key: 'name', label: 'Nombre', _style: { width: '15%'} },
    { key: 'description', label: 'Descripción', _style: { width: '15%'} },
    { key: 'marca', label: 'Marca', _style: { width: '15%'} },
    { key: 'categories', label: 'Categorias', _style: { width: '15%'} },
    { key: 'deleted_at', label: 'Estado', _style: { width: '10%'} },
    {
      key: 'acciones',
      label: 'Acciones',
      _style: { width: '15%' },
      sorter: false,
      filter: false
    }
  ];

  const openModal= (producto) =>{
    dispatch(setProducto(producto));
    dispatch(uiOpenModal(
      <span><i className="fa fa-pencil"/> Editar Producto</span>,
      'Guardar Cambios',
      'modificar')
    );
  }

  const openModalEtiqueta= (producto) =>{
    dispatch(setProducto(producto));
    dispatch(uiOpenProductoEtiquetaModal(
      <span><i className="fa fa-tag"/> Etiqueta</span>,
      'Guardar Imagen',
      'modificar')
    );
  }

  const toggleAlert = (tipo, producto) => {
    dispatch(setProducto(producto));
    dispatch(uiOpenProductosDialog(
      <span><i className='fa fa-exclamation-triangle' /> Confirmación</span>,
      <span>Está seguro que quiere cambiar el producto a estado <strong>{tipo}</strong>?</span>,
      'Si',
      'No',
      tipo)
    );
  }

  return (
    <CDataTable
      items={productos}
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
        'categories':
          (item)=>(
            <td>
              {
                item.categories.map( (category, i) => (
                  <CBadge className="mr-1" key={i} color="primary">{category.label}</CBadge>
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
                        color="primary"
                        variant="outline"
                        shape="square"
                        onClick={()=>{openModalEtiqueta(item)}}
                      >
                        <i className="fa fa-tag font-lg"/>
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

export default TablaProductos
