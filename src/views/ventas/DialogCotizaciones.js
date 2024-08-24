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

export const DialogCotizaciones = (props) => {
  const dispatch = useDispatch();
  const {dialogCotizacionesOpen, dialogTitle, dialogBody, dialogButtonOk, dialogButtonCancel, dialogAction, loading} = useSelector(state => state.ui);
  const {cotizacion} = useSelector(state => state.cotizaciones);

  const handleClick = () => {
    switch (dialogAction){
      case 'crear':
        props.f1(cotizacion);
        break;
      default: break;
    }
  }

  const closeDialog = () =>{
    dispatch(uiCloseDialog());
  }

  return(
    <CModal
      show={dialogCotizacionesOpen}
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
        <CButton onClick={handleClick} disabled={loading} color="primary">{dialogButtonOk}</CButton>
        {' '}
        <CButton
          color="secondary"
          onClick={closeDialog}
        >{dialogButtonCancel}</CButton>
      </CModalFooter>
    </CModal>
  )
}
