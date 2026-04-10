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
import TablaProductos from './TablaProductos'
import { ModalProductos } from './ModalProductos'
import { DialogProductos } from './DialogProductos'
import { useProductosStore } from '../../stores/useProductosStore'
import { useMarcasStore } from '../../stores/useMarcasStore'
import { useCategoriasStore } from '../../stores/useCategoriasStore'
import { ModalEtiqueta } from './ModalEtiqueta'
import { cilPlus } from '@coreui/icons'

const AdministrarProductos = () => {
  const [visible, setVisible] = useState(false)
  const { openModal } = useUIStore()
  const { getProductos, resetProductos } = useProductosStore()
  const { getMarcas } = useMarcasStore()
  const { getCategorias } = useCategoriasStore()

  useEffect(() => {
    getProductos()
    getMarcas('combo')
    getCategorias('combo')
  }, [])

  const openModalNuevo = () => {
    resetProductos()
    openModal(
      <span>
        <CIcon icon={cilPlus} /> {`Nuevo Producto`}
      </span>,
      'Crear Producto',
      'crear',
    )
  }

  return (
    <CRow>
      <CCol xs="12">
        <CCard>
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <div className="card-header-actions text-start">
              <CCardTitle>Lista de Productos</CCardTitle>
            </div>
            <div className="card-header-actions text-end">
              <CButton color="primary" onClick={openModalNuevo}>
                <CIcon icon={cilPlus} /> Nuevo
              </CButton>
            </div>
          </CCardHeader>
          <CCardBody className="d-flex justify-content-between align-items-center table-responsive">
            <TablaProductos />
          </CCardBody>
        </CCard>
      </CCol>
      <ModalProductos />
      <ModalEtiqueta />
      <DialogProductos />
    </CRow>
  )
}

export default AdministrarProductos
