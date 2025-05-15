import React, { useEffect } from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow, CButton, CCardTitle } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { useDispatch } from 'react-redux'
import { uiOpenModal } from '../../actions/uiAction'
import { getPrecios, resetPrecios } from '../../actions/preciosAction'
import TablaPrecios from './TablaPrecios'
import { ModalPrecios } from './ModalPrecios'
import { DialogPrecios } from './DialogPrecios'
import { cilPlus } from '@coreui/icons'

const AdministrarPrecios = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getPrecios())
  }, [dispatch])

  const openModal = () => {
    dispatch(resetPrecios())
    dispatch(
      uiOpenModal(
        <span>
          <CIcon icon={cilPlus} /> Nueva Lista de Precios
        </span>,
        'Crear Lista de Precio',
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
              <CCardTitle>Lista de Precios</CCardTitle>
            </div>
            <div className="card-header-actions text-end">
              <CButton color="primary" onClick={openModal}>
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
