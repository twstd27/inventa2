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
import { useUIStore } from '../../stores/useUIStore'
import { useStockStore } from '../../stores/useStockStore'
import { useSucursalesStore } from '../../stores/useSucursalesStore'
import { useProductosStore } from '../../stores/useProductosStore'
import TablaEntradas from './TablaEntradas'
import { ModalEntradas } from './ModalEntradas'
import { DialogEntradas } from './DialogEntradas'
import { cilPlus } from '@coreui/icons'

const AdministrarEntradas = () => {
  const { openModal } = useUIStore()
  const { getEntradas, resetEntradas } = useStockStore()
  const { getSucursales } = useSucursalesStore()
  const { getProductos } = useProductosStore()

  const [visible, setVisible] = useState(false)

  useEffect(() => {
    getEntradas(1, 5)
    getSucursales('combo')
    getProductos('combo')
  }, [])

  const openModalNew = (type) => {
    resetEntradas()
    openModal(
      <span>
        <CIcon icon={cilPlus} /> {`Nueva ${type} de inventario`}
      </span>,
      `Crear ${type} de inventario`,
      {
        action: 'crear',
        type,
      },
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
                  openModalNew('entrada')
                }}
              >
                <CIcon icon={cilPlus} /> Nuevo
              </CButton>
            </div>
          </CCardHeader>
          <CCardBody className="d-flex justify-content-between align-items-center">
            <TablaEntradas />
          </CCardBody>
        </CCard>
      </CCol>
      <ModalEntradas />
      <DialogEntradas />
    </CRow>
  )
}

export default AdministrarEntradas
