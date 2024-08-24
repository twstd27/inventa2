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
import {getCategorias, resetCategorias} from "../../actions/categoriasAction";
import TablaCategorias from "./TablaCategorias";
import {ModalCategorias} from "./ModalCategorias";
import {DialogCategorias} from "./DialogCategorias";

const AdministrarCategorias = () => {
  const [collapsed, setCollapsed] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCategorias());
  }, [dispatch]);

  const openModal = () => {
    dispatch(resetCategorias());
    dispatch(uiOpenModal(
      <span><i className="fa fa-plus-circle"/> Nueva Categoria</span>,
      'Crear Categoria',
      'crear')
    );
  }

  return (
    <CRow>
      <CCol xs="12">
        <CCard>
          <CCardHeader>
            <span className="h1">Lista de Categorias</span>
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
              <TablaCategorias/>
            </CCardBody>
          </CCollapse>
        </CCard>
      </CCol>
      <ModalCategorias/>
      <DialogCategorias/>
    </CRow>
  )
}

export default AdministrarCategorias
