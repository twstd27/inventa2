import React from 'react'
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import { useUIStore } from '../../stores/useUIStore'
import { useStockStore } from '../../stores/useStockStore'

export const DialogEntradas = () => {
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
  const { entrada, deleteEntry, restoreEntry } = useStockStore()

  const handleClick = () => {
    if (dialogAction === 'activo') {
      restoreEntry(entrada)
    } else {
      deleteEntry(entrada)
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
