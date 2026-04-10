import React, { useEffect, useState } from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow, CButton, CCardTitle } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { useUIStore } from '../../stores/useUIStore'
import { useMarcasStore } from '../../stores/useMarcasStore'
import TablaMarcas from './TablaMarcas'
import { ModalMarcas } from './ModalMarcas'
import { DialogMarcas } from './DialogMarcas'
import { cilPlus } from '@coreui/icons'

const AdministrarMarcas = () => {
  const { openModal } = useUIStore()
  const { getMarcas, resetMarcas } = useMarcasStore()

  useEffect(() => {
    getMarcas()
  }, [])

  const openModalNuevo = () => {
    resetMarcas()
    openModal(
      <span>
        <CIcon icon={cilPlus} /> Nueva Marca
      </span>,
      'Crear Marca',
      'crear',
    )
  }

  return (
    <CRow>
      <CCol xs="12">
        <CCard>
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <div className="card-header-actions text-start">
              <CCardTitle>Lista de Marcas</CCardTitle>
            </div>
            <div className="card-header-actions text-end">
              <CButton color="primary" onClick={openModalNuevo}>
                <CIcon icon={cilPlus} /> Nuevo
              </CButton>
            </div>
          </CCardHeader>
          <CCardBody>
            <TablaMarcas />
          </CCardBody>
        </CCard>
      </CCol>
      <ModalMarcas />
      <DialogMarcas />
    </CRow>
  )
}

export default AdministrarMarcas
