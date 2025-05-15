import React, { useEffect } from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow, CButton, CCardTitle } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { useDispatch } from 'react-redux'
import { uiOpenModal } from '../../actions/uiAction'
import { getCategorias, resetCategorias } from '../../actions/categoriasAction'
import TablaCategorias from './TablaCategorias'
import { ModalCategorias } from './ModalCategorias'
import { DialogCategorias } from './DialogCategorias'
import { cilPlus } from '@coreui/icons'

const AdministrarCategorias = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getCategorias())
  }, [dispatch])

  const openModal = () => {
    dispatch(resetCategorias())
    dispatch(
      uiOpenModal(
        <span>
          <CIcon icon={cilPlus} /> Nueva Categoria
        </span>,
        'Crear Categoria',
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
              <CCardTitle>Lista de Categorias</CCardTitle>
            </div>
            <div className="card-header-actions text-end">
              <CButton color="primary" onClick={openModal}>
                <CIcon icon={cilPlus} /> Nuevo
              </CButton>
            </div>
          </CCardHeader>
          <CCardBody>
            <TablaCategorias />
          </CCardBody>
        </CCard>
      </CCol>
      <ModalCategorias />
      <DialogCategorias />
    </CRow>
  )
}

export default AdministrarCategorias
