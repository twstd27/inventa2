import React from 'react'
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import { useUIStore } from '../../stores/useUIStore'
import { useMarcasStore } from '../../stores/useMarcasStore'

export const DialogMarcas = () => {
  const {
    dialogOpen,
    dialogTitle,
    dialogBody,
    dialogButtonOk,
    dialogButtonCancel,
    dialogAction,
    closeDialog,
  } = useUIStore()
  const loading = useUIStore((s) => s.loadingCount > 0)
  const { marca, deleteBrand, restoreBrand } = useMarcasStore()

  const handleClick = () => {
    if (dialogAction === 'activo') {
      restoreBrand(marca)
    } else {
      deleteBrand(marca)
    }
  }

  return (
    <CModal visible={dialogOpen} onClose={closeDialog} color="primary" size="sm">
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
