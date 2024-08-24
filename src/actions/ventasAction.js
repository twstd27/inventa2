import {API, types} from "../types/types";
import axios from "axios";
import {finishLoading, startLoading, uiCloseDialog} from "./uiAction";
import {errorResponse} from "../helpers/global";

export const getVentas = (type = '') => {
  let URI = '';
  switch (type){
    case 'lista': URI = '/sales/lista'; break;
    default: URI = '/sales'; break;
  }
  return async (dispatch) => {
    dispatch(startLoading());
    await axios.get(API + URI)
      .then((response) => {
        dispatch(setVentas(response.data.data));
      })
      .catch((error) => {
        console.log(error.response);
      });
    dispatch(finishLoading());
  }
}

export const getVenta = (id, type = '') => {
  return async (dispatch) => {
    dispatch(startLoading());
    await axios.get(`${API}/sales/${id}`)
      .then((response) => {
        if(type === 'imp'){
          dispatch(setVentaImp(response.data.data));
        }
        else{
          dispatch(setVenta(response.data.data));
        }
      })
      .catch((error) => {
        console.log(error.response);
      });
    dispatch(finishLoading());
  }
}

export const registerSale = (sale) => {
  return async (dispatch) => {
    dispatch(startLoading());
    delete sale.doc_date;
    await axios.post(`${API}/sales`, sale)
      .then(async (response) => {
        if(response.status === 201){
          dispatch(getVentas());
          dispatch(setError({
            status: '',
            message: '',
            errors: []
          }));
        }
        dispatch(uiCloseDialog());
      })
      .catch((error) => {
        console.log(error.response);
        const err = errorResponse(error);
        dispatch(setError(err));
      });
    dispatch(finishLoading());
  }
}

export const modifySale = (sale) => {
  console.log(sale);
}

export const deleteSale = (sale) => {
  return async (dispatch) => {
    dispatch(startLoading());
    await axios.delete(`${API}/sales/${sale.id}`, sale)
      .then((response) => {
        dispatch(getVentas());
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

export const setVentas = (ventas) => ({
  type: types.ventas.setVentas,
  payload: {
    ventas
  }
});

export const setVenta = (venta) => ({
  type: types.ventas.setVenta,
  payload: {
    venta
  }
});

export const setVentaImp = (venta) => ({
  type: types.ventas.setVentaImp,
  payload: {
    venta
  }
});

export const setError = (error) => ({
  type: types.ventas.setError,
  payload:{
    error
  }
});

export const resetVentas = () => ({ type: types.ventas.resetModal});


export const getDiario = (data = {}) => {
  return async (dispatch) => {
    dispatch(startLoading());
    await axios.get(API + `/sales/diario?d=${data.fecha}&b=${data.sucursal}`)
      .then((response) => {
        dispatch(setDiario(response.data.data));
      })
      .catch((error) => {
        console.log(error.response);
      });
    dispatch(finishLoading());
  }
}

export const setDiario = (registros) => ({
  type: types.ventas.setDiario,
  payload: {
    registros
  }
});
