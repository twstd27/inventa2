import React, { useEffect, useState } from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow, CButton, CCardTitle } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { useDispatch } from 'react-redux'
import { uiOpenModal } from '../../actions/uiAction'
import { getMarcas, resetMarcas } from '../../actions/marcasActions'
import TablaMarcas from './TablaMarcas'
import { ModalMarcas } from './ModalMarcas'
import { DialogMarcas } from './DialogMarcas'
import { cilPlus } from '@coreui/icons'

const AdministrarMarcas = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getMarcas())
  }, [dispatch])

  const openModal = () => {
    dispatch(resetMarcas())
    dispatch(
      uiOpenModal(
        <span>
          <CIcon icon={cilPlus} /> Nueva Marca
        </span>,
        'Crear Marca',
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
              <CCardTitle>Lista de Marcas</CCardTitle>
            </div>
            <div className="card-header-actions text-end">
              <CButton color="primary" onClick={openModal}>
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
