import React from "react";
import {
  CButton,
  CModal,
  CModalBody, CModalFooter,
  CModalHeader,
  CModalTitle
} from "@coreui/react";
import {useDispatch, useSelector} from "react-redux";
import {uiCloseDialog} from "../../actions/uiAction";
import {deleteEntry, restoreEntry} from "../../actions/stockAction";

export const DialogEntradas = () => {
  const dispatch = useDispatch();
  const {dialogOpen, dialogTitle, dialogBody, dialogButtonOk, dialogButtonCancel, dialogAction, loading} = useSelector(state => state.ui);
  const {entrada} = useSelector(state => state.stock);

  const handleClick = () => {
    if (dialogAction === 'activo') {
      dispatch(restoreEntry(entrada));
    } else {
      dispatch(deleteEntry(entrada));
    }
  }

  const closeDialog = () =>{
    dispatch(uiCloseDialog());
  }

  return(
    <CModal
      show={dialogOpen}
      onClose={closeDialog}
      color="primary"
      size="sm"
    >
      <CModalHeader closeButton>
        <CModalTitle>{dialogTitle}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        {dialogBody}
      </CModalBody>
      <CModalFooter>
        <CButton onClick={handleClick} disabled={loading} color="primary">{dialogButtonOk}</CButton>{' '}
        <CButton
          color="secondary"
          onClick={closeDialog}
        >{dialogButtonCancel}</CButton>
      </CModalFooter>
    </CModal>
  )
}
