import {types} from "../types/types";

const initialState = {
  loading: false,
  modalOpen: false,
  modalProductosOpen: false,
  modalVentasOpen: false,
  modalCotizacionesOpen: false,
  modalTitle: '',
  modalButton: '',
  modalAction: '',
  dialogOpen: false,
  dialogProductosOpen: false,
  dialogVentasOpen: false,
  dialogCotizacionesOpen: false,
  dialogTitle: '',
  dialogBody: '',
  dialogButtonOk: '',
  dialogButtonCancel: '',
  dialogAction: '',
}

export const uiReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.ui.startLoading:
      return {
        ...state,
        loading: true
      }
    case types.ui.finishLoading:
      return {
        ...state,
        loading: false
      }
    case types.ui.openModal:
      return {
        ...state,
        modalOpen: true,
        modalTitle: action.payload.title,
        modalButton: action.payload.button,
        modalAction: action.payload.action
      }
    case types.ui.openProductosModal:
      return {
        ...state,
        modalProductosOpen: true,
        modalTitle: action.payload.title,
        modalButton: action.payload.button,
        modalAction: action.payload.action
      }
    case types.ui.modalProductoEtiquetaOpen:
      return {
        ...state,
        modalProductoEtiquetaOpen: true,
        modalTitle: action.payload.title,
        modalButton: action.payload.button,
        modalAction: action.payload.action
      }
    case types.ui.openVentasModal:
      return {
        ...state,
        modalVentasOpen: true,
        modalTitle: action.payload.title,
        modalButton: action.payload.button,
        modalAction: action.payload.action
      }
    case types.ui.openCotizacionesModal:
      return {
        ...state,
        modalCotizacionesOpen: true,
        modalTitle: action.payload.title,
        modalButton: action.payload.button,
        modalAction: action.payload.action
      }
    case types.ui.closeModal:
      return {
        ...state,
        modalOpen: false,
        modalProductosOpen: false,
        modalVentasOpen: false,
        modalCotizacionesOpen: false,
        modalProductoEtiquetaOpen: false,
        modalTitle: '',
        modalButton: '',
        modalAction: ''
      }
    case types.ui.openDialog:
      return {
        ...state,
        dialogOpen: true,
        dialogTitle: action.payload.title,
        dialogBody: action.payload.body,
        dialogButtonOk: action.payload.buttonOk,
        dialogButtonCancel: action.payload.buttonCancel,
        dialogAction: action.payload.action,
      }
    case types.ui.openProductosDialog:
      return {
        ...state,
        dialogProductOpen: true,
        dialogTitle: action.payload.title,
        dialogBody: action.payload.body,
        dialogButtonOk: action.payload.buttonOk,
        dialogButtonCancel: action.payload.buttonCancel,
        dialogAction: action.payload.action,
      }
    case types.ui.openVentasDialog:
      return {
        ...state,
        dialogVentasOpen: true,
        dialogTitle: action.payload.title,
        dialogBody: action.payload.body,
        dialogButtonOk: action.payload.buttonOk,
        dialogButtonCancel: action.payload.buttonCancel,
        dialogAction: action.payload.action,
      }
    case types.ui.openCotizacionesDialog:
      return {
        ...state,
        dialogCotizacionesOpen: true,
        dialogTitle: action.payload.title,
        dialogBody: action.payload.body,
        dialogButtonOk: action.payload.buttonOk,
        dialogButtonCancel: action.payload.buttonCancel,
        dialogAction: action.payload.action,
      }
    case types.ui.closeDialog:
      return {
        ...state,
        dialogOpen: false,
        dialogProductOpen: false,
        dialogVentasOpen: false,
        dialogCotizacionesOpen: false,
        dialogTitle: '',
        dialogBody: '',
        dialogButtonOk: '',
        dialogButtonCancel: '',
        dialogAction: '',
      }
    case types.ui.reset:
      return {
        ...state,
        loading: false,
        modalOpen: false,
        modalTitle: '',
        modalButton: '',
        modalAction: ''
      }
    default:
      return state;
  }
}
