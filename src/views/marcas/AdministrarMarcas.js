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
import TablaMarcas from "./TablaMarcas";
import {useDispatch} from "react-redux";
import {getMarcas, resetMarcas} from "../../actions/marcasActions";
import {ModalMarcas} from "./ModalMarcas";
import {uiOpenModal} from "../../actions/uiAction";
import {DialogMarcas} from "./DialogMarcas";

const AdministrarMarcas = () => {
  const [collapsed, setCollapsed] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMarcas());
  }, [dispatch]);

  const openModal = () => {
    dispatch(resetMarcas());
    dispatch(uiOpenModal(
      <span><i className="fa fa-plus-circle"/> Nueva Marca</span>,
      'Crear Marca',
      'crear')
    );
  }

  return (
    <CRow>
      <CCol xs="12">
        <CCard>
          <CCardHeader>
            <span className="h1">Lista de Marcas</span>
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
              <TablaMarcas/>
            </CCardBody>
          </CCollapse>
        </CCard>
      </CCol>
      <ModalMarcas/>
      <DialogMarcas/>
    </CRow>
  )
}

export default AdministrarMarcas
