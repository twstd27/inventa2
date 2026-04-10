import React, { useEffect } from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow, CButton, CCardTitle } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { useUIStore } from '../../stores/useUIStore'
import { usePreciosStore } from '../../stores/usePreciosStore'
import TablaPrecios from './TablaPrecios'
import { ModalPrecios } from './ModalPrecios'
import { DialogPrecios } from './DialogPrecios'
import { cilPlus } from '@coreui/icons'

const AdministrarPrecios = () => {
  const { openModal } = useUIStore()
  const { getPrecios, resetPrecios } = usePreciosStore()

  useEffect(() => {
    getPrecios()
  }, [])

  const openModalNew = () => {
    resetPrecios()
    openModal(
      <span>
        <CIcon icon={cilPlus} /> Nueva Lista de Precios
      </span>,
      'Crear Lista de Precio',
      'crear',
    )
  }

  return (
    <CRow>
      <CCol xs="12">
        <CCard>
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <div className="card-header-actions text-start">
              <CCardTitle>Lista de Precios</CCardTitle>
            </div>
            <div className="card-header-actions text-end">
              <CButton color="primary" onClick={openModalNew}>
                <CIcon icon={cilPlus} /> Nuevo
              </CButton>
            </div>
          </CCardHeader>
          <CCardBody>
            <TablaPrecios />
          </CCardBody>
        </CCard>
      </CCol>
      <ModalPrecios />
      <DialogPrecios />
    </CRow>
  )
}

export default AdministrarPrecios
