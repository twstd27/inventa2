import React from 'react'
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import { uiCloseDialog } from '../../actions/uiAction'
import { deleteCategory, restoreCategory } from '../../actions/categoriasAction'

export const DialogCategorias = () => {
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
  const { categoria } = useSelector((state) => state.categorias)

  const handleClick = () => {
    if (dialogAction === 'activo') {
      dispatch(restoreCategory(categoria))
    } else {
      dispatch(deleteCategory(categoria))
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
