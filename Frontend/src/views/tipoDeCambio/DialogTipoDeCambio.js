import React from 'react'
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import { uiCloseDialog } from '../../actions/uiAction'
import { deleteTipoDeCambio, restoreTipoDeCambio } from '../../actions/tipoDeCambioAction'

export const DialogTipoDeCambio = () => {
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
  const { tipoDeCambio } = useSelector((state) => state.tipoDeCambio)

  const handleClick = () => {
    if (dialogAction === 'activo') {
      dispatch(restoreTipoDeCambio(tipoDeCambio))
    } else {
      dispatch(deleteTipoDeCambio(tipoDeCambio))
    }
  }

  const closeDialog = () => dispatch(uiCloseDialog())

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
