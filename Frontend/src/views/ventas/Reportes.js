import { useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
  CTabs,
  CTab,
  CTabList,
  CTabPanel,
  CTabContent,
} from '@coreui/react'
import { useVentasStore } from '../../stores/useVentasStore'
import { useSucursalesStore } from '../../stores/useSucursalesStore'
import TablaVentas from './TablaVentas'
import { ModalVentas } from './ModalVentas'
import { DialogVentas } from './DialogVentas'
import Diario from './Diario'
import { CircleDollarSign, Tag } from 'lucide-react'

const Reportes = () => {
  const { getVentas } = useVentasStore()
  const { getSucursales } = useSucursalesStore()

  useEffect(() => {
    getVentas()
    getSucursales('combo')
  }, [])

  return (
    <CRow>
      <CCol xs="12">
        <CCard>
          <CCardBody>
            <CTabs defaultActiveItemKey={1}>
              <CTabList variant="underline-border">
                <CTab aria-controls="home-tab-pane" itemKey={1}>
                  <Tag /> Lista de Ventas
                </CTab>
                <CTab aria-controls="profile-tab-pane" itemKey={2}>
                  <CircleDollarSign /> Reporte Diario
                </CTab>
              </CTabList>
              <CTabContent>
                <CTabPanel className="py-3" itemKey={1}>
                  <TablaVentas />
                </CTabPanel>
                <CTabPanel className="py-3" itemKey={2}>
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

export default Reportes
