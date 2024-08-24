import {types} from "../types/types";

export const startLoading = () => ({
  type: types.ui.startLoading,
  payload:{
    loading: true
  }
});

export const finishLoading = () => ({ type: types.ui.finishLoading});

export const uiOpenModal = (title, button, action) => ({
  type: types.ui.openModal,
  payload:{
    title,
    button,
    action
  }
});

export const uiOpenProductosModal = (title, button, action) => ({
  type: types.ui.openProductosModal,
  payload:{
    title,
    button,
    action
  }
});

export const uiOpenVentasModal = (title, button, action) => ({
  type: types.ui.openVentasModal,
  payload:{
    title,
    button,
    action
  }
});

export const uiOpenCotizacionesModal = (title, button, action) => ({
  type: types.ui.openCotizacionesModal,
  payload:{
    title,
    button,
    action
  }
});

export const uiOpenProductoEtiquetaModal = (title, button, action) => ({
  type: types.ui.modalProductoEtiquetaOpen,
  payload:{
    title,
    button,
    action
  }
});

export const uiCloseModal = () => ({ type: types.ui.closeModal });

export const uiOpenDialog = (title, body, buttonOk, buttonCancel, action) => ({
  type: types.ui.openDialog,
  payload:{
    title,
    body,
    buttonOk,
    buttonCancel,
    action
  }
});

export const uiOpenProductosDialog = (title, body, buttonOk, buttonCancel, action) => ({
  type: types.ui.openProductosDialog,
  payload:{
    title,
    body,
    buttonOk,
    buttonCancel,
    action
  }
});

export const uiOpenVentasDialog = (title, body, buttonOk, buttonCancel, action) => ({
  type: types.ui.openVentasDialog,
  payload:{
    title,
    body,
    buttonOk,
    buttonCancel,
    action
  }
});

export const uiOpenCotizacionesDialog = (title, body, buttonOk, buttonCancel, action) => ({
  type: types.ui.openCotizacionesDialog,
  payload:{
    title,
    body,
    buttonOk,
    buttonCancel,
    action
  }
});

export const uiCloseDialog = () => ({ type: types.ui.closeDialog });

export const uiReset = () => ({ type: types.ui.reset });
