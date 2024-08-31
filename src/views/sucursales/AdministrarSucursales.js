import React, { useEffect, useState } from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow, CButton, CCardTitle } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { useDispatch } from 'react-redux'
import { uiOpenModal } from '../../actions/uiAction'
import { getSucursales, resetSucursales } from '../../actions/sucursalesAction'
import TablaSucursales from './TablaSucursales'
import { ModalSucursales } from './ModalSucursales'
import { DialogSucursales } from './DialogSucursales'
import { cilPlus } from '@coreui/icons'

const AdministrarSucursales = () => {
  const [collapsed, setCollapsed] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getSucursales())
  }, [dispatch])

  const openModal = () => {
    dispatch(resetSucursales())
    dispatch(
      uiOpenModal(
        <span>
          <CIcon icon={cilPlus} /> Nueva Sucursal
        </span>,
        'Crear Sucursal',
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
              <CCardTitle>Lista de Sucursales</CCardTitle>
            </div>
            <div className="card-header-actions text-end">
              <CButton color="primary" onClick={openModal}>
                <CIcon icon={cilPlus} /> Nuevo
              </CButton>
            </div>
          </CCardHeader>
          <CCardBody>
            <TablaSucursales />
          </CCardBody>
        </CCard>
      </CCol>
      <ModalSucursales />
      <DialogSucursales />
    </CRow>
  )
}

export default AdministrarSucursales
