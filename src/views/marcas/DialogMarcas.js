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
import {deleteBrand, restoreBrand} from "../../actions/marcasActions";

export const DialogMarcas = () => {
  const dispatch = useDispatch();
  const { dialogOpen, dialogTitle, dialogBody, dialogButtonOk, dialogButtonCancel, dialogAction, loading} = useSelector(state => state.ui);
  const {marca} = useSelector(state => state.marcas);

  const handleClick = () => {
    if (dialogAction === 'activo') {
      dispatch(restoreBrand(marca));
    } else {
      dispatch(deleteBrand(marca));
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
