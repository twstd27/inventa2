import React, { useEffect } from 'react'
import { CCard, CCardBody, CCardHeader, CCardTitle, CCol, CRow, CButton } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPlus } from '@coreui/icons'
import { useUIStore } from '../../stores/useUIStore'
import { useTipoDeCambioStore } from '../../stores/useTipoDeCambioStore'
import TablaTiposDeCambio from './TablaTiposDeCambio'
import { ModalTipoDeCambio } from './ModalTipoDeCambio'
import { DialogTipoDeCambio } from './DialogTipoDeCambio'

const AdministrarTiposDeCambio = () => {
  const { openModal } = useUIStore()
  const { getTiposDeCambio, resetTipoDeCambio } = useTipoDeCambioStore()

  useEffect(() => {
    getTiposDeCambio()
  }, [])

  const openModalNew = () => {
    resetTipoDeCambio()
    openModal(
      <span>
        <CIcon icon={cilPlus} /> Nuevo Tipo de Cambio
      </span>,
      'Crear Tipo de Cambio',
      'crear',
    )
  }

  return (
    <CRow>
      <CCol xs="12">
        <CCard>
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <div className="text-start">
              <CCardTitle>Tipos de Cambio</CCardTitle>
            </div>
            <div className="text-end">
              <CButton color="primary" onClick={openModalNew}>
                <CIcon icon={cilPlus} /> Nuevo
              </CButton>
            </div>
          </CCardHeader>
          <CCardBody>
            <TablaTiposDeCambio />
          </CCardBody>
        </CCard>
      </CCol>
      <ModalTipoDeCambio />
      <DialogTipoDeCambio />
    </CRow>
  )
}

export default AdministrarTiposDeCambio
