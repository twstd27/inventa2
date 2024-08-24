import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCardTitle,
  CLink,
  CCol,
  CRow,
  CCollapse,
  CButton,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { useDispatch } from 'react-redux'
import { uiOpenModal } from '../../actions/uiAction'
import TablaUsuarios from './TablaUsuarios'
import { ModalUsuarios } from './ModalUsuarios'
import { DialogUsuarios } from './DialogUsuarios'
import { getUsuarios, resetUsuarios } from '../../actions/usuariosAction'
import { getRoles } from '../../actions/rolesAction'
import { cilPlus } from '@coreui/icons'

const AdministrarUsuarios = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getUsuarios('lista'))
    dispatch(getRoles('combo'))
  }, [dispatch])

  const openModal = () => {
    dispatch(resetUsuarios())
    dispatch(
      uiOpenModal(
        <span>
          <CIcon icon={cilPlus} /> Nuevo Usuario
        </span>,
        'Crear Usuario',
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
              <CCardTitle>Lista de Usuarios</CCardTitle>
            </div>
            {/* <span className="h1">Lista de Usuarios</span> */}
            <div className="card-header-actions text-end">
              <CButton color="primary" onClick={openModal}>
                <CIcon icon={cilPlus} /> Nuevo
                {/* <i className="fa fa-plus-circle" /> Nuevo */}
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
