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
import TablaProductos from './TablaProductos'
import { ModalProductos } from './ModalProductos'
import { DialogProductos } from './DialogProductos'
import { getProductos, resetProductos } from '../../actions/productosAction'
import { getMarcas } from '../../actions/marcasActions'
import { getCategorias } from '../../actions/categoriasAction'
import { ModalEtiqueta } from './ModalEtiqueta'
import { cilPlus } from '@coreui/icons'

const AdministrarProductos = () => {
  const [visible, setVisible] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getProductos())
    dispatch(getMarcas('combo'))
    dispatch(getCategorias('combo'))
  }, [dispatch])

  const openModal = () => {
    dispatch(resetProductos())
    dispatch(
      uiOpenModal(
        <span>
          <CIcon icon={cilPlus} /> {`Nuevo Producto`}
        </span>,
        'Crear Producto',
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
              <CCardTitle>Lista de Productos</CCardTitle>
            </div>
            <div className="card-header-actions text-end">
              <CButton color="primary" onClick={openModal}>
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
