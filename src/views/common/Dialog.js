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

export const Dialog = () => {
  const dispatch = useDispatch();
  const {dialogOpen, dialogTitle, dialogBody, dialogButtonCancel} = useSelector(state => state.ui);

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
        <CButton
          color="secondary"
          onClick={closeDialog}
        >{dialogButtonCancel}</CButton>
      </CModalFooter>
    </CModal>
  )
}
