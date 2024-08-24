import {
  CButton,
  CCol,
  CFormGroup,
  CLabel,
  CModal,
  CModalBody, CModalFooter,
  CModalHeader,
  CModalTitle, CRow,
  CTextarea
} from "@coreui/react";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {uiCloseModal} from "../../actions/uiAction";
import html2canvas from 'html2canvas';

const Barcode = require('react-barcode');

export const ModalEtiqueta = () => {
  const dispatch = useDispatch();
  const {modalProductoEtiquetaOpen, modalTitle, modalButton, loading} = useSelector(state => state.ui);
  const {producto} = useSelector(state => state.productos);

  const {name, description, code, price} = producto;

  const CloseModal= () =>{
    dispatch(uiCloseModal());
  }

  const handleClick = () => {
    const element = document.getElementById("etiqueta");

    html2canvas(element).then(function(canvas) {
      saveAs(canvas.toDataURL(), `${code}.png`);
    });
  }

  const saveAs = (uri, filename) => {

    let link = document.createElement('a');

    if (typeof link.download === 'string') {

      link.href = uri;
      link.download = filename;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      CloseModal();

    } else {
      window.open(uri);
    }
  }

  return(
    <CModal
      show={modalProductoEtiquetaOpen}
      onClose={CloseModal}
      color="primary"
      closeOnBackdrop={false}
    >
      <CModalHeader closeButton>
        <CModalTitle>{modalTitle}</CModalTitle>
      </CModalHeader>
      <CModalBody className={'bg-tag'} id="etiqueta">
        <CRow>
          <CCol xs="12">
            <CFormGroup className={'div-tag'}>
              <CLabel htmlFor="name">Nombre</CLabel>
              <CTextarea
                className={'input-tag'}
                defaultValue={(name === null) ? '' : name}
                name="name"
                rows="1"
              />
              <CLabel htmlFor="code">Código</CLabel>
              <CTextarea
                className={'input-tag'}
                defaultValue={(code === null) ? '' : code}
                name="code"
                rows="1"
              />
              <CLabel htmlFor="price">Precio</CLabel>
              <CTextarea
                className={'input-tag'}
                defaultValue={(price === null) ? '' : price}
                name="price"
                rows="1"
              />
              <CLabel htmlFor="description">Descripción</CLabel>
              <CTextarea
                defaultValue={(description === null) ? '' : description}
                name="description"
                rows="3"
              />
            </CFormGroup>
          </CCol>
          <CCol xs="12">
            <div className="d-flex justify-content-center">
              <Barcode displayValue={false} value={code || "sin codigo"} />
            </div>
          </CCol>
        </CRow>
      </CModalBody>
      <CModalFooter>
        <CButton color="primary" disabled={loading} onClick={handleClick}>
          {loading && (
            <>
              <i className="fa fa-spinner fa-spin"/>
            </>
          )}
          {!loading && <span> {modalButton}</span>}
        </CButton>{' '}
        <CButton
          color="secondary"
          onClick={CloseModal}
        >Cancelar</CButton>
      </CModalFooter>
    </CModal>
  )
}
