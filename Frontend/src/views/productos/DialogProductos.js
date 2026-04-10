import React from 'react'
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import { useUIStore } from '../../stores/useUIStore'
import { useProductosStore } from '../../stores/useProductosStore'

export const DialogProductos = () => {
  const {
    dialogProductosOpen,
    dialogTitle,
    dialogBody,
    dialogButtonOk,
    dialogButtonCancel,
    dialogAction,
    closeDialog,
  } = useUIStore()
  const loading = useUIStore((s) => s.loadingCount > 0)
  const { producto, deleteProduct, restoreProduct } = useProductosStore()

  const handleClick = () => {
    if (dialogAction === 'activo') {
      restoreProduct(producto)
    } else {
      deleteProduct(producto)
    }
  }

  return (
    <CModal visible={dialogProductosOpen} onClose={closeDialog} color="primary" size="sm">
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
