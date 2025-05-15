import {API, types} from "../types/types";
import axios from "axios";
import {finishLoading, startLoading, uiCloseDialog, uiCloseModal} from "./uiAction";
import {errorResponse} from "../helpers/global";

export const getSucursales = (type = '') => {
  const URI = (type === 'combo') ? '/branches/combo' : '/branches';

  return async (dispatch) => {
    await axios.get(API + URI)
      .then((response) => {
        switch (type){
          case 'combo':
            dispatch(setSucursalesCombo(response.data.data));
            break;
          default:
            dispatch(setSucursales(response.data.data));
            break;
        }
      })
      .catch((error) => {
        //console.log(error.response);
      });
  }
}

export const registerBranch = (branch) => {
  return async (dispatch) => {
    dispatch(startLoading());
    await axios.post(`${API}/branches`, branch)
      .then((response) => {
        dispatch(getSucursales());
        dispatch(setError({
          status: '',
          message: '',
          errors: []
        }));
        dispatch(uiCloseModal());
      })
      .catch((error) => {
        const err = errorResponse(error);
        dispatch(setError(err));
      });
    dispatch(finishLoading());
  }
}

export const modifyBranch = (branch) => {
  return async (dispatch) => {
    dispatch(startLoading());
    await axios.put(`${API}/branches/${branch.id}`, branch)
      .then((response) => {
        dispatch(getSucursales());
        dispatch(setError({
          status: '',
          message: '',
          errors: []
        }));
        dispatch(uiCloseModal());
      })
      .catch((error) => {
        const err = errorResponse(error);
        dispatch(setError(err));
      });
    dispatch(finishLoading());
  }
}

export const deleteBranch = (branch) => {
  return async (dispatch) => {
    dispatch(startLoading());
    await axios.delete(`${API}/branches/${branch.id}`, branch)
      .then((response) => {
        dispatch(getSucursales());
        dispatch(setError({
          status: '',
          message: '',
          errors: []
        }));
        dispatch(uiCloseDialog());
      })
      .catch((error) => {
        const err = errorResponse(error);
        dispatch(setError(err));
      });
    dispatch(finishLoading());
  }
}

export const restoreBranch = (branch) => {
  return async (dispatch) => {
    dispatch(startLoading());
    await axios.post(`${API}/branches/${branch.id}/restore`, branch)
      .then((response) => {
        dispatch(getSucursales());
        dispatch(setError({
          status: '',
          message: '',
          errors: []
        }));
        dispatch(uiCloseDialog());
      })
      .catch((error) => {
        const err = errorResponse(error);
        dispatch(setError(err));
      });
    dispatch(finishLoading());
  }
}

export const setSucursales = (sucursales) => ({
  type: types.sucursales.setSucursales,
  payload: {
    sucursales
  }
});

export const setSucursalesCombo = (sucursales) => ({
  type: types.sucursales.setSucursalesCombo,
  payload: {
    sucursales
  }
});

export const setSucursal = (sucursal) => ({
  type: types.sucursales.setSucursal,
  payload: {
    sucursal
  }
});

export const setError = (error) => ({
  type: types.sucursales.setError,
  payload:{
    error
  }
});

export const resetSucursales = () => ({ type: types.sucursales.resetModal});
