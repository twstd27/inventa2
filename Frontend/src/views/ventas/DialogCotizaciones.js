import React from "react";
import {
  CButton,
  CModal,
  CModalBody, CModalFooter,
  CModalHeader,
  CModalTitle
} from "@coreui/react";
import { useUIStore } from '../../stores/useUIStore'
import { useCotizacionesStore } from '../../stores/useCotizacionesStore'

export const DialogCotizaciones = (props) => {
  const {dialogCotizacionesOpen, dialogTitle, dialogBody, dialogButtonOk, dialogButtonCancel, dialogAction, closeDialog} = useUIStore();
  const loading = useUIStore((s) => s.loadingCount > 0)
  const {cotizacion} = useCotizacionesStore();

  const handleClick = () => {
    switch (dialogAction){
      case 'crear':
        props.f1(cotizacion);
        break;
      default: break;
    }
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
