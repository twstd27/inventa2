import {API, types} from "../types/types";
import axios from "axios";
import {finishLoading, startLoading, uiCloseDialog} from "./uiAction";
import {errorResponse} from "../helpers/global";

export const getCotizaciones = (type = '') => {
  let URI = '';
  switch (type){
    case 'lista': URI = '/quotations/lista'; break;
    default: URI = '/quotations'; break;
  }
  return async (dispatch) => {
    dispatch(startLoading());
    await axios.get(API + URI)
      .then((response) => {
        dispatch(setCotizaciones(response.data.data));
      })
      .catch((error) => {
        console.log(error.response);
      });
    dispatch(finishLoading());
  }
}

export const getCotizacion = (id, type = '') => {
  return async (dispatch) => {
    dispatch(startLoading());
    await axios.get(`${API}/quotations/${id}`)
      .then((response) => {
        if(type === 'imp'){
          dispatch(setCotizacionImp(response.data.data));
        }
        else{
          dispatch(setCotizacion(response.data.data));
        }
      })
      .catch((error) => {
        console.log(error.response);
      });
    dispatch(finishLoading());
  }
}

export const registerQuotation = (sale) => {
  return async (dispatch) => {
    dispatch(startLoading());
    delete sale.doc_date;
    await axios.post(`${API}/quotations`, sale)
      .then(async (response) => {
        if(response.status === 201){
          dispatch(getCotizaciones());
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

export const modifyQuotation = (quotation) => {
  console.log(quotation);
}

export const setCotizaciones = (cotizaciones) => ({
  type: types.cotizaciones.setCotizaciones,
  payload: {
    cotizaciones
  }
});

export const setCotizacion = (cotizacion) => ({
  type: types.cotizaciones.setCotizacion,
  payload: {
    cotizacion
  }
});

export const setCotizacionImp = (cotizacion) => ({
  type: types.cotizaciones.setCotizacionImp,
  payload: {
    cotizacion
  }
});

export const setError = (error) => ({
  type: types.cotizaciones.setError,
  payload:{
    error
  }
});

export const resetCotizaciones = () => ({ type: types.cotizaciones.resetModal});
