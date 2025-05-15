import React from 'react'
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import { uiCloseDialog } from '../../actions/uiAction'
import { restoreRole, deleteRole } from '../../actions/rolesAction'

export const DialogRoles = () => {
  const dispatch = useDispatch()
  const {
    dialogOpen,
    dialogTitle,
    dialogBody,
    dialogButtonOk,
    dialogButtonCancel,
    dialogAction,
    loading,
  } = useSelector((state) => state.ui)
  const { rol } = useSelector((state) => state.roles)

  const handleClick = () => {
    if (dialogAction === 'activo') {
      dispatch(restoreRole(rol))
    } else {
      dispatch(deleteRole(rol))
    }
  }

  const closeDialog = () => {
    dispatch(uiCloseDialog())
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
