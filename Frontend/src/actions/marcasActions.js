import {API, types} from "../types/types";
import axios from "axios";
import {finishLoading, startLoading, uiCloseDialog, uiCloseModal} from "./uiAction";
import {errorResponse} from "../helpers/global";

export const getMarcas = (type = '') => {
  const URI = (type === 'combo') ? '/brands/combo' : '/brands'

  return async (dispatch) => {
    await axios.get(API + URI)
      .then((response) => {
        switch (type){
          case 'combo':
            dispatch(setMarcasCombo(response.data.data));
            break;
          default:
            dispatch(setMarcas(response.data.data));
            break;
        }
      })
      .catch((error) => {
        //console.log(error.response);
      });
  }
}

export const registerBrand = (brand) => {
  return async (dispatch) => {
    dispatch(startLoading());
    await axios.post(`${API}/brands`, brand)
      .then((response) => {
        dispatch(getMarcas());
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

export const modifyBrand = (brand) => {
  return async (dispatch) => {
    dispatch(startLoading());
    await axios.put(`${API}/brands/${brand.id}`, brand)
      .then((response) => {
        dispatch(getMarcas());
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

export const deleteBrand = (brand) => {
  return async (dispatch) => {
    dispatch(startLoading());
    await axios.delete(`${API}/brands/${brand.id}`, brand)
      .then((response) => {
        dispatch(getMarcas());
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

export const restoreBrand = (brand) => {
  return async (dispatch) => {
    dispatch(startLoading());
    await axios.post(`${API}/brands/${brand.id}/restore`, brand)
      .then((response) => {
        dispatch(getMarcas());
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

export const setMarcas = (marcas) => ({
  type: types.marcas.setMarcas,
  payload: {
    marcas
  }
});

export const setMarcasCombo = (marcas) => ({
  type: types.marcas.setMarcasCombo,
  payload: {
    marcas
  }
});

export const setMarca = (marca) => ({
  type: types.marcas.setMarca,
  payload: {
    marca
  }
});

export const setError = (error) => ({
  type: types.marcas.setError,
  payload:{
    error
  }
});

export const resetMarcas = () => ({ type: types.marcas.resetModal});
