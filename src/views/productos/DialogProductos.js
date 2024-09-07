import React from 'react'
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import { uiCloseDialog } from '../../actions/uiAction'
import { deleteProduct, restoreProduct } from '../../actions/productosAction'

export const DialogProductos = () => {
  const dispatch = useDispatch()
  const {
    dialogProductOpen,
    dialogTitle,
    dialogBody,
    dialogButtonOk,
    dialogButtonCancel,
    dialogAction,
    loading,
  } = useSelector((state) => state.ui)
  const { producto } = useSelector((state) => state.productos)

  const handleClick = () => {
    if (dialogAction === 'activo') {
      dispatch(restoreProduct(producto))
    } else {
      dispatch(deleteProduct(producto))
    }
  }

  const closeDialog = () => {
    dispatch(uiCloseDialog())
  }

  return (
    <CModal visible={dialogProductOpen} onClose={closeDialog} color="primary" size="sm">
      <CModalHeader closeButton>
        <CModalTitle>{dialogTitle}</CModalTitle>
      </CModalHeader>
      <CModalBody>{dialogBody}</CModalBody>
      <CModalFooter>
        <CButton onClick={handleClick} disabled={loading} color="primary">
          {dialogButtonOk}
        </CButton>{' '}
        <CButton color="secondary" onClick={closeDialog}>
          {dialogButtonCancel}
        </CButton>
      </CModalFooter>
    </CModal>
  )
}
