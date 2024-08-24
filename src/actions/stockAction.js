import {API, types} from "../types/types";
import axios from "axios";
import {finishLoading, startLoading, uiCloseDialog, uiCloseModal} from "./uiAction";
import {errorResponse} from "../helpers/global";

export const getEntradas = () => {
  return async (dispatch) => {
    await axios.get(`${API}/entries/entradas`)
      .then((response) => {
        dispatch(setEntradas(response.data.data));
      })
      .catch((error) => {
        console.log(error.response);
      });
  }
}

export const getSalidas = () => {
  return async (dispatch) => {
    await axios.get(`${API}/entries/salidas`)
      .then((response) => {
        dispatch(setSalidas(response.data.data));
      })
      .catch((error) => {
        console.log(error.response);
      });
  }
}

export const registerEntry = (entry) => {
  return async (dispatch) => {
    dispatch(startLoading());
    await axios.post(`${API}/entries`, entry)
      .then((response) => {
        dispatch(getEntradas());
        dispatch(getSalidas());
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

export const modifyEntry = (entry) => {
  return async (dispatch) => {
    dispatch(startLoading());
    await axios.put(`${API}/entries/${entry.id}`, entry)
      .then((response) => {
        dispatch(getEntradas());
        dispatch(getSalidas());
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

export const deleteEntry = (entry) => {
  return async (dispatch) => {
    dispatch(startLoading());
    await axios.delete(`${API}/entries/${entry.id}`, entry)
      .then((response) => {
        dispatch(getEntradas());
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

export const restoreEntry = (entry) => {
  return async (dispatch) => {
    dispatch(startLoading());
    await axios.post(`${API}/entries/${entry.id}/restore`, entry)
      .then((response) => {
        dispatch(getEntradas());
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

export const setEntradas = (entradas) => ({
  type: types.entradas.setEntradas,
  payload: {
    entradas
  }
});

export const setSalidas = (salidas) => ({
  type: types.salidas.setSalidas,
  payload: {
    salidas
  }
});

export const setEntrada = (entrada) => ({
  type: types.entradas.setEntrada,
  payload: {
    entrada
  }
});

export const setError = (error) => ({
  type: types.entradas.setError,
  payload:{
    error
  }
});

export const resetEntradas = () => ({ type: types.entradas.resetModal});
