import React, {useEffect, useState} from 'react';
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
  CTabs,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane
} from '@coreui/react'
import {useDispatch} from "react-redux";
import TablaVentas from "./TablaVentas";
import {getVentas} from "../../actions/ventasAction";
import {ModalVentas} from "./ModalVentas";
import {DialogVentas} from "./DialogVentas";
import Diario from "./Diario";
import {getSucursales} from "../../actions/sucursalesAction";

const AdministrarMarcas = () => {
  const [state, setState] = useState({
    active: 0
  });
  const {active} = state;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getVentas());
    dispatch(getSucursales('combo'));
  }, [dispatch]);

  return (
    <CRow>
      <CCol xs="12">
        <CCard>
          <CCardBody>
            <CTabs activeTab={active} onActiveTabChange={() => {setState({...state, active})}}>
              <CNav variant="tabs" className="d-print-none">
                <CNavItem>
                  <CNavLink>
                    <i className="fa fa-tags"/> Lista de Ventas
                  </CNavLink>
                </CNavItem>
                <CNavItem>
                  <CNavLink>
                    <i className="fa fa-money"/> Reporte Diario
                  </CNavLink>
                </CNavItem>
              </CNav>
              <CTabContent>
                <CTabPane className="pt-3">
                  <TablaVentas/>
                </CTabPane>
                <CTabPane className="pt-3">
                  <Diario/>
                </CTabPane>
              </CTabContent>
            </CTabs>
          </CCardBody>
        </CCard>
      </CCol>
      <ModalVentas/>
      <DialogVentas/>
    </CRow>
  )
}

export default AdministrarMarcas
