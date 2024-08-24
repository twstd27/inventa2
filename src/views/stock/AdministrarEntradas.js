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
import TablaEntradas from "./TablaEntradas";
import {ModalEntradas} from "./ModalEntradas";
import {DialogEntradas} from "./DialogEntradas";
import {getEntradas, getSalidas, resetEntradas} from "../../actions/stockAction";
import TablaSalidas from "./TablaSalidas";
import {getSucursales} from "../../actions/sucursalesAction";
import {getProductos} from "../../actions/productosAction";

const AdministrarEntradas = () => {
  const [collapsedEntradas, setCollapsedEntradas] = useState(true);
  const [collapsedSalidas, setCollapsedSalidas] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getEntradas());
    dispatch(getSalidas());
    dispatch(getSucursales('combo'));
    dispatch(getProductos('combo'));
  }, [dispatch]);

  const openModal = (type) => {
    dispatch(resetEntradas());
    dispatch(uiOpenModal(
      <span><i className="fa fa-plus-circle"/> {`Nueva ${type} de inventario`}</span>,
      `Crear ${type} de inventario`,
      {
        action: 'crear',
        type
      })
    );
  }

  return (
    <CRow>
      <CCol xs="12">
        <CCard>
          <CCardHeader>
            <span className="h1">Lista de Entradas de Inventario</span>
            <div className="card-header-actions">
              <CButton color="primary" onClick={() => {openModal('entrada')}}>
                <i className="fa fa-plus-circle"/> Nuevo
              </CButton>
              <CLink className="card-header-action" onClick={() => setCollapsedEntradas(!collapsedEntradas)}>
                <CIcon name={collapsedEntradas ? 'cil-chevron-bottom':'cil-chevron-top'} />
              </CLink>
            </div>
          </CCardHeader>
          <CCollapse show={collapsedEntradas}>
            <CCardBody>
              <TablaEntradas/>
            </CCardBody>
          </CCollapse>
        </CCard>
      </CCol>
      <CCol xs="12">
        <CCard>
          <CCardHeader>
            <span className="h1">Lista de Salidas de Inventario</span>
            <div className="card-header-actions">
              <CButton color="primary" onClick={() => {openModal('salida')}}>
                <i className="fa fa-plus-circle"/> Nuevo
              </CButton>
              <CLink className="card-header-action" onClick={() => setCollapsedSalidas(!collapsedSalidas)}>
                <CIcon name={collapsedSalidas ? 'cil-chevron-bottom':'cil-chevron-top'} />
              </CLink>
            </div>
          </CCardHeader>
          <CCollapse show={collapsedSalidas}>
            <CCardBody>
              <TablaSalidas/>
            </CCardBody>
          </CCollapse>
        </CCard>
      </CCol>
      <ModalEntradas/>
      <DialogEntradas/>
    </CRow>
  )
}

export default AdministrarEntradas
