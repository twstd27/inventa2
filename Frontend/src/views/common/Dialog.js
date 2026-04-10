import React from 'react'
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import { useUIStore } from '../../stores/useUIStore'

export const Dialog = () => {
  const { dialogOpen, dialogTitle, dialogBody, dialogButtonCancel, closeDialog } = useUIStore()

  return (
    <CModal visible={dialogOpen} onClose={closeDialog} color="primary" size="sm">
      <CModalHeader closeButton className="bg-primary text-white">
        <CModalTitle>{dialogTitle}</CModalTitle>
      </CModalHeader>
      <CModalBody>{dialogBody}</CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={closeDialog}>
          {dialogButtonCancel}
        </CButton>
      </CModalFooter>
    </CModal>
  )
}
