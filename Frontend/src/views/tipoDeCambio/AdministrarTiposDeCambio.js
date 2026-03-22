import React, { useEffect } from 'react'
import { CCard, CCardBody, CCardHeader, CCardTitle, CCol, CRow, CButton } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPlus } from '@coreui/icons'
import { useDispatch } from 'react-redux'
import { uiOpenModal } from '../../actions/uiAction'
import { getTiposDeCambio, resetTipoDeCambio } from '../../actions/tipoDeCambioAction'
import TablaTiposDeCambio from './TablaTiposDeCambio'
import { ModalTipoDeCambio } from './ModalTipoDeCambio'
import { DialogTipoDeCambio } from './DialogTipoDeCambio'

const AdministrarTiposDeCambio = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getTiposDeCambio())
  }, [dispatch])

  const openModal = () => {
    dispatch(resetTipoDeCambio())
    dispatch(
      uiOpenModal(
        <span>
          <CIcon icon={cilPlus} /> Nuevo Tipo de Cambio
        </span>,
        'Crear Tipo de Cambio',
        'crear',
      ),
    )
  }

  return (
    <CRow>
      <CCol xs="12">
        <CCard>
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <div className="text-start">
              <CCardTitle>Tipos de Cambio</CCardTitle>
            </div>
            <div className="text-end">
              <CButton color="primary" onClick={openModal}>
                <CIcon icon={cilPlus} /> Nuevo
              </CButton>
            </div>
          </CCardHeader>
          <CCardBody>
            <TablaTiposDeCambio />
          </CCardBody>
        </CCard>
      </CCol>
      <ModalTipoDeCambio />
      <DialogTipoDeCambio />
    </CRow>
  )
}

export default AdministrarTiposDeCambio
