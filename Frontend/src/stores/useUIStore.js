import { create } from 'zustand'

const emptyModal = { title: '', button: '', action: '' }
const emptyDialog = { title: '', body: '', buttonOk: '', buttonCancel: '', action: '' }

export const useUIStore = create((set) => ({
  loadingCount: 0,
  modalOpen: false,
  modalProductosOpen: false,
  modalVentasOpen: false,
  modalCotizacionesOpen: false,
  modalProductoEtiquetaOpen: false,
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
  venta: {},

  // loading
  startLoading: () => set((s) => ({ loadingCount: s.loadingCount + 1 })),
  finishLoading: () => set((s) => ({ loadingCount: Math.max(0, s.loadingCount - 1) })),

  // modals
  openModal: (title, button, action) =>
    set({ modalOpen: true, modalTitle: title, modalButton: button, modalAction: action }),
  openProductosModal: (title, button, action) =>
    set({ modalProductosOpen: true, modalTitle: title, modalButton: button, modalAction: action }),
  openVentasModal: (title, button, action) =>
    set({ modalVentasOpen: true, modalTitle: title, modalButton: button, modalAction: action }),
  openCotizacionesModal: (title, button, action) =>
    set({ modalCotizacionesOpen: true, modalTitle: title, modalButton: button, modalAction: action }),
  openProductoEtiquetaModal: (title, button, action) =>
    set({ modalProductoEtiquetaOpen: true, modalTitle: title, modalButton: button, modalAction: action }),
  closeModal: () =>
    set({
      modalOpen: false,
      modalProductosOpen: false,
      modalVentasOpen: false,
      modalCotizacionesOpen: false,
      modalProductoEtiquetaOpen: false,
      ...emptyModal,
    }),

  // dialogs
  openDialog: (title, body, buttonOk, buttonCancel, action) =>
    set({ dialogOpen: true, dialogTitle: title, dialogBody: body, dialogButtonOk: buttonOk, dialogButtonCancel: buttonCancel, dialogAction: action }),
  openProductosDialog: (title, body, buttonOk, buttonCancel, action) =>
    set({ dialogProductosOpen: true, dialogTitle: title, dialogBody: body, dialogButtonOk: buttonOk, dialogButtonCancel: buttonCancel, dialogAction: action }),
  openVentasDialog: (title, body, buttonOk, buttonCancel, action, venta = {}) =>
    set({ dialogVentasOpen: true, dialogTitle: title, dialogBody: body, dialogButtonOk: buttonOk, dialogButtonCancel: buttonCancel, dialogAction: action, venta }),
  openCotizacionesDialog: (title, body, buttonOk, buttonCancel, action) =>
    set({ dialogCotizacionesOpen: true, dialogTitle: title, dialogBody: body, dialogButtonOk: buttonOk, dialogButtonCancel: buttonCancel, dialogAction: action }),
  closeDialog: () =>
    set({
      dialogOpen: false,
      dialogProductosOpen: false,
      dialogVentasOpen: false,
      dialogCotizacionesOpen: false,
      ...emptyDialog,
      venta: {},
    }),
}))
