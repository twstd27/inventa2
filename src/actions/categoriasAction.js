import {API, types} from "../types/types";
import axios from "axios";
import {finishLoading, startLoading, uiCloseDialog, uiCloseModal} from "./uiAction";
import {errorResponse} from "../helpers/global";

export const getCategorias = (type = '') => {
  const URI = (type === 'combo') ? '/categories/combo' : '/categories'

  return async (dispatch) => {
    await axios.get(`${API + URI}`)
      .then((response) => {
        switch (type){
          case 'combo':
            dispatch(setCategoriasCombo(response.data.data));
            break;
          default:
            dispatch(setCategorias(response.data.data));
            break;
        }
      })
      .catch((error) => {
        //console.log(error.response);
      });
  }
}

export const registerCategory = (category) => {
  return async (dispatch) => {
    dispatch(startLoading());
    await axios.post(`${API}/categories`, category)
      .then((response) => {
        dispatch(getCategorias());
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

export const modifyCategory = (category) => {
  return async (dispatch) => {
    dispatch(startLoading());
    await axios.put(`${API}/categories/${category.id}`, category)
      .then((response) => {
        dispatch(getCategorias());
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

export const deleteCategory = (category) => {
  return async (dispatch) => {
    dispatch(startLoading());
    await axios.delete(`${API}/categories/${category.id}`, category)
      .then((response) => {
        dispatch(getCategorias());
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

export const restoreCategory = (category) => {
  return async (dispatch) => {
    dispatch(startLoading());
    await axios.post(`${API}/categories/${category.id}/restore`, category)
      .then((response) => {
        dispatch(getCategorias());
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

export const setCategorias = (categorias) => ({
  type: types.categorias.setCategorias,
  payload: {
    categorias
  }
});

export const setCategoriasCombo = (categorias) => ({
  type: types.categorias.setCategoriasCombo,
  payload: {
    categorias
  }
});

export const setCategoria = (categoria) => ({
  type: types.categorias.setCategoria,
  payload: {
    categoria
  }
});

export const setError = (error) => ({
  type: types.categorias.setError,
  payload:{
    error
  }
});

export const resetCategorias = () => ({ type: types.categorias.resetModal});
