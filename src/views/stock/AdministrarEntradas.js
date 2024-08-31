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
import TablaEntradas from './TablaEntradas'
import { ModalEntradas } from './ModalEntradas'
import { DialogEntradas } from './DialogEntradas'
import { getEntradas, getSalidas, resetEntradas } from '../../actions/stockAction'
// import TablaSalidas from './TablaSalidas'
import { getSucursales } from '../../actions/sucursalesAction'
import { getProductos } from '../../actions/productosAction'
import { cilPlus } from '@coreui/icons'

const AdministrarEntradas = () => {
  const dispatch = useDispatch()

  const [visible, setVisible] = useState(false)

  useEffect(() => {
    dispatch(getEntradas(1, 5))
    dispatch(getSalidas())
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
              <CCardTitle>Lista de Entradas de Inventario</CCardTitle>
            </div>
            <div className="card-header-actions text-end">
              <CButton
                color="primary"
                onClick={() => {
                  openModal('entrada')
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
            <TablaEntradas />
          </CCardFooter>
        </CCard>
      </CCol>
      {/* <CCol xs="12">
        <CCard>
          <CCardHeader>
            <span className="h1">Lista de Salidas de Inventario</span>
            <div className="card-header-actions">
              <CButton
                color="primary"
                onClick={() => {
                  openModal('salida')
                }}
              >
                <i className="fa fa-plus-circle" /> Nuevo
              </CButton>
              <CLink
                className="card-header-action"
                onClick={() => setCollapsedSalidas(!collapsedSalidas)}
              >
                <CIcon name={collapsedSalidas ? 'cil-chevron-bottom' : 'cil-chevron-top'} />
              </CLink>
            </div>
          </CCardHeader>
          <CCollapse show={collapsedSalidas}>
            <CCardBody><TablaSalidas/></CCardBody>
          </CCollapse>
        </CCard>
      </CCol> */}
      <ModalEntradas />
      <DialogEntradas />
    </CRow>
  )
}

export default AdministrarEntradas
