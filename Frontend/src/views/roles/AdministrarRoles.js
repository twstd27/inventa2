import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardTitle,
  CCardBody,
  CCardHeader,
  CLink,
  CCol,
  CRow,
  CCollapse,
  CButton,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { useUIStore } from '../../stores/useUIStore'
import { useRolesStore } from '../../stores/useRolesStore'
import { ModalRoles } from './ModalRoles'
import { DialogRoles } from './DialogRoles'
import TablaRoles from './TablaRoles'
import { cilPlus } from '@coreui/icons'

const AdministrarRoles = () => {
  const { openModal } = useUIStore()
  const { getRoles, resetRoles } = useRolesStore()

  useEffect(() => {
    getRoles()
  }, [])

  const openModalNew = () => {
    resetRoles()
    openModal(
      <span>
        <CIcon icon={cilPlus} /> Nuevo Rol
      </span>,
      'Crear Rol',
      'crear',
    )
  }

  return (
    <CRow>
      <CCol xs="12">
        <CCard>
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <div className="card-header-actions text-start">
              <CCardTitle>Lista de Roles</CCardTitle>
            </div>
            <div className="card-header-actions text-end">
              <CButton color="primary" onClick={openModalNew}>
                <CIcon icon={cilPlus} /> Nuevo
              </CButton>
            </div>
          </CCardHeader>
          <CCardBody>
            <TablaRoles />
          </CCardBody>
        </CCard>
      </CCol>
      <ModalRoles />
      <DialogRoles />
    </CRow>
  )
}

export default AdministrarRoles
