import React from 'react'
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import { useUIStore } from '../../stores/useUIStore'
import { useTipoDeCambioStore } from '../../stores/useTipoDeCambioStore'

export const DialogTipoDeCambio = () => {
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
  const { tipoDeCambio, deleteTipoDeCambio, restoreTipoDeCambio } = useTipoDeCambioStore()

  const handleClick = () => {
    if (dialogAction === 'activo') {
      restoreTipoDeCambio(tipoDeCambio)
    } else {
      deleteTipoDeCambio(tipoDeCambio)
    }
  }

  return (
    <CModal visible={dialogOpen} onClose={closeDialog} size="sm">
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
