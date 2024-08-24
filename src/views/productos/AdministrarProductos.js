import React, {useEffect, useState} from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CLink,
  CCol,
  CRow,
  CCollapse, CButton
} from '@coreui/react'
import CIcon from "@coreui/icons-react";
import {useDispatch} from "react-redux";
import {uiOpenModal} from "../../actions/uiAction";
import {ModalProductos} from "./ModalProductos";
import {DialogProductos} from "./DialogProductos";
import TablaProductos from "./TablaProductos";
import {getProductos, resetProductos} from "../../actions/productosAction";
import {getMarcas} from "../../actions/marcasActions";
import {getCategorias} from "../../actions/categoriasAction";
import {ModalEtiqueta} from "./ModalEtiqueta";

const AdministrarProductos = () => {
  const [collapsed, setCollapsed] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProductos());
    dispatch(getMarcas('combo'));
    dispatch(getCategorias('combo'));
  }, [dispatch]);

  const openModal = () => {
    dispatch(resetProductos());
    dispatch(uiOpenModal(
      <span><i className="fa fa-plus-circle"/> Nuevo Producto</span>,
      'Crear Producto',
      'crear')
    );
  }

  return (
    <CRow>
      <CCol xs="12">
        <CCard>
          <CCardHeader>
            <span className="h1">Lista de Productos</span>
            <div className="card-header-actions">
              <CButton color="primary" onClick={openModal}>
                <i className="fa fa-plus-circle"/> Nuevo
              </CButton>
              <CLink className="card-header-action" onClick={() => setCollapsed(!collapsed)}>
                <CIcon name={collapsed ? 'cil-chevron-bottom':'cil-chevron-top'} />
              </CLink>
            </div>
          </CCardHeader>
          <CCollapse show={collapsed}>
            <CCardBody>
              <TablaProductos/>
            </CCardBody>
          </CCollapse>
        </CCard>
      </CCol>
      <ModalProductos/>
      <ModalEtiqueta/>
      <DialogProductos/>
    </CRow>
  )
}

export default AdministrarProductos
