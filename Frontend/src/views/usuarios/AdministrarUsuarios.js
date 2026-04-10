import React, { useEffect, useState } from 'react'
import { CCard, CCardBody, CCardHeader, CCardTitle, CCol, CRow, CButton } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { useUIStore } from '../../stores/useUIStore'
import { useUsuariosStore } from '../../stores/useUsuariosStore'
import { useRolesStore } from '../../stores/useRolesStore'
import TablaUsuarios from './TablaUsuarios'
import { ModalUsuarios } from './ModalUsuarios'
import { DialogUsuarios } from './DialogUsuarios'
import { cilPlus } from '@coreui/icons'

const AdministrarUsuarios = () => {
  const { openModal } = useUIStore()
  const { getUsuarios, resetUsuarios } = useUsuariosStore()
  const { getRoles } = useRolesStore()

  useEffect(() => {
    getUsuarios('lista')
    getRoles('combo')
  }, [])

  const openModalNew = () => {
    resetUsuarios()
    openModal(
      <span>
        <CIcon icon={cilPlus} /> Nuevo Usuario
      </span>,
      'Crear Usuario',
      'crear',
    )
  }

  return (
    <CRow>
      <CCol xs="12">
        <CCard>
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <div className="card-header-actions text-start">
              <CCardTitle>Lista de Usuarios</CCardTitle>
            </div>
            <div className="card-header-actions text-end">
              <CButton color="primary" onClick={openModalNew}>
                <CIcon icon={cilPlus} /> Nuevo
              </CButton>
            </div>
          </CCardHeader>
          <CCardBody>
            <TablaUsuarios />
          </CCardBody>
        </CCard>
      </CCol>
      <ModalUsuarios />
      <DialogUsuarios />
    </CRow>
  )
}

export default AdministrarUsuarios
