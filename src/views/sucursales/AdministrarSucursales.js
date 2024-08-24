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
import {getSucursales, resetSucursales} from "../../actions/sucursalesAction";
import TablaSucursales from "./TablaSucursales";
import {ModalSucursales} from "./ModalSucursales";
import {DialogSucursales} from "./DialogSucursales";

const AdministrarSucursales = () => {
  const [collapsed, setCollapsed] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getSucursales());
  }, [dispatch]);

  const openModal = () => {
    dispatch(resetSucursales());
    dispatch(uiOpenModal(
      <span><i className="fa fa-plus-circle"/> Nueva Sucursal</span>,
      'Crear Sucursal',
      'crear')
    );
  }

  return (
    <CRow>
      <CCol xs="12">
        <CCard>
          <CCardHeader>
            <span className="h1">Lista de Sucursales</span>
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
              <TablaSucursales/>
            </CCardBody>
          </CCollapse>
        </CCard>
      </CCol>
      <ModalSucursales/>
      <DialogSucursales/>
    </CRow>
  )
}

export default AdministrarSucursales
