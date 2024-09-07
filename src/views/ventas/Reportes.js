import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
  CTabs,
  CTab,
  CTabList,
  CTabPanel,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
} from '@coreui/react'
import { useDispatch } from 'react-redux'
import TablaVentas from './TablaVentas'
import { getVentas } from '../../actions/ventasAction'
import { ModalVentas } from './ModalVentas'
import { DialogVentas } from './DialogVentas'
import Diario from './Diario'
import { getSucursales } from '../../actions/sucursalesAction'
import { CircleDollarSign, Tag } from 'lucide-react'

const AdministrarMarcas = () => {
  const [state, setState] = useState({
    active: 1,
  })
  const { active } = state
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getVentas())
    dispatch(getSucursales('combo'))
  }, [dispatch])

  return (
    <CRow>
      <CCol xs="12">
        <CCard>
          <CCardBody>
            <CTabs activeItemKey={active}>
              <CTabList variant="underline-border">
                <CTab aria-controls="home-tab-pane" itemKey={1}>
                  <Tag /> Lista de Ventas
                </CTab>
                <CTab aria-controls="profile-tab-pane" itemKey={2}>
                  <CircleDollarSign /> Reporte Diario
                </CTab>
              </CTabList>
              <CTabContent>
                <CTabPanel className="py-3" aria-labelledby="home-tab-pane" itemKey={1}>
                  <TablaVentas />
                </CTabPanel>
                <CTabPanel className="py-3" aria-labelledby="profile-tab-pane" itemKey={2}>
                  <Diario />
                </CTabPanel>
              </CTabContent>
            </CTabs>
          </CCardBody>
        </CCard>
      </CCol>
      <ModalVentas />
      <DialogVentas />
    </CRow>
  )
}

export default AdministrarMarcas
