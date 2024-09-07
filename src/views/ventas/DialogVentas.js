import React from 'react'
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import { uiCloseDialog } from '../../actions/uiAction'
import { deleteSale } from '../../actions/ventasAction'

export const DialogVentas = (props) => {
  const dispatch = useDispatch()
  const {
    dialogVentasOpen,
    dialogTitle,
    dialogBody,
    dialogButtonOk,
    dialogButtonCancel,
    dialogAction,
    loading,
  } = useSelector((state) => state.ui)
  const { venta } = useSelector((state) => state.ventas)

  const handleClick = () => {
    switch (dialogAction) {
      case 'crear':
        props.f1(venta)
        break
      case 'inactivo':
        dispatch(deleteSale(venta))
        break
      default:
        break
    }
  }

  const closeDialog = () => {
    dispatch(uiCloseDialog())
  }

  return (
    <CModal visible={dialogVentasOpen} onClose={closeDialog} color="primary" size="sm">
      <CModalHeader closeButton>
        <CModalTitle>{dialogTitle}</CModalTitle>
      </CModalHeader>
      <CModalBody>{dialogBody}</CModalBody>
      <CModalFooter>
        <CButton onClick={handleClick} disabled={loading} color="primary">
          {dialogButtonOk}
        </CButton>
        <CButton color="secondary" onClick={closeDialog}>
          {dialogButtonCancel}
        </CButton>
      </CModalFooter>
    </CModal>
  )
}
