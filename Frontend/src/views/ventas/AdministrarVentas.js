import React, {useEffect, useState} from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CLink,
  CCol,
  CRow,
  CCollapse
} from '@coreui/react'
import CIcon from "@coreui/icons-react";
import {useDispatch} from "react-redux";
import TablaVentas from "./TablaVentas";
import {getVentas} from "../../actions/ventasAction";
import {ModalVentas} from "./ModalVentas";
import {DialogVentas} from "./DialogVentas";

const AdministrarMarcas = () => {
  const [collapsed, setCollapsed] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getVentas());
  }, [dispatch]);

  return (
    <CRow>
      <CCol xs="12" className="d-print-none">
        <CCard>
          <CCardHeader>
            <span className="h1">Lista de Ventas</span>
            <div className="card-header-actions">
              <CLink className="card-header-action" onClick={() => setCollapsed(!collapsed)}>
                <CIcon name={collapsed ? 'cil-chevron-bottom':'cil-chevron-top'} />
              </CLink>
            </div>
          </CCardHeader>
          <CCollapse show={collapsed}>
            <CCardBody>
              <TablaVentas/>
            </CCardBody>
          </CCollapse>
        </CCard>
      </CCol>
      <ModalVentas/>
      <DialogVentas/>
    </CRow>
  )
}

export default AdministrarMarcas
