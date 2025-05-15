import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCardFooter,
  CCollapse,
  CCol,
  CRow,
  CButton,
  CCardTitle,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { useDispatch } from 'react-redux'
import { uiOpenModal } from '../../actions/uiAction'
import TablaSalidas from './TablaSalidas'
import { ModalEntradas } from './ModalEntradas'
import { DialogEntradas } from './DialogEntradas'
import { getSalidas, resetEntradas } from '../../actions/stockAction'
import { getSucursales } from '../../actions/sucursalesAction'
import { getProductos } from '../../actions/productosAction'
import { cilPlus } from '@coreui/icons'

const AdministrarSalidas = () => {
  const dispatch = useDispatch()

  const [visible, setVisible] = useState(false)

  useEffect(() => {
    dispatch(getSalidas(1, 5))
    dispatch(getSucursales('combo'))
    dispatch(getProductos('combo'))
  }, [dispatch])

  const openModal = (type) => {
    dispatch(resetEntradas())
    dispatch(
      uiOpenModal(
        <span>
          <CIcon icon={cilPlus} /> {`Nueva ${type} de inventario`}
        </span>,
        `Crear ${type} de inventario`,
        {
          action: 'crear',
          type,
        },
      ),
    )
  }

  return (
    <CRow>
      <CCol xs="12">
        <CCard>
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <div className="card-header-actions text-start">
              <CCardTitle>Lista de Salidas de Inventario</CCardTitle>
            </div>
            <div className="card-header-actions text-end">
              <CButton
                color="primary"
                onClick={() => {
                  openModal('salida')
                }}
              >
                <CIcon icon={cilPlus} /> Nuevo
              </CButton>
            </div>
          </CCardHeader>
          <CCardBody className="d-flex justify-content-between align-items-center">
            <CButton
              color="primary"
              href="#"
              onClick={(event) => {
                event.preventDefault()
                setVisible(!visible)
              }}
            >
              Mostrar Filtros
            </CButton>
            <CCollapse visible={visible}>Proximamente...</CCollapse>
          </CCardBody>
          <CCardFooter>
            <TablaSalidas />
          </CCardFooter>
        </CCard>
      </CCol>
      <ModalEntradas />
      <DialogEntradas />
    </CRow>
  )
}

export default AdministrarSalidas
