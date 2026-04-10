import React from 'react'
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import { useUIStore } from '../../stores/useUIStore'
import { usePreciosStore } from '../../stores/usePreciosStore'

export const DialogPrecios = () => {
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
  const { listaPrecio, deletePriceList, restorePriceList } = usePreciosStore()

  const handleClick = () => {
    if (dialogAction === 'activo') {
      restorePriceList(listaPrecio)
    } else {
      deletePriceList(listaPrecio)
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
