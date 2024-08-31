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
import { useDispatch } from 'react-redux'
import { uiOpenModal } from '../../actions/uiAction'
import { getRoles, resetRoles } from '../../actions/rolesAction'
import { ModalRoles } from './ModalRoles'
import { DialogRoles } from './DialogRoles'
import TablaRoles from './TablaRoles'
import { cilPlus } from '@coreui/icons'

const AdministrarRoles = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getRoles())
  }, [dispatch])

  const openModal = () => {
    dispatch(resetRoles())
    dispatch(
      uiOpenModal(
        <span>
          <CIcon icon={cilPlus} /> Nuevo Rol
        </span>,
        'Crear Rol',
        'crear',
      ),
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
              <CButton color="primary" onClick={openModal}>
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
