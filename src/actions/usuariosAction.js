import {API, types} from "../types/types";
import axios from 'axios';
import {errorResponse} from "../helpers/global";
import {finishLoading, startLoading, uiCloseDialog, uiCloseModal} from "./uiAction";

export const getUsuarios = (type = '') => {
  let URI = '';
  switch (type){
    case 'lista': URI = '/users/lista'; break;
    default: URI = '/users'; break;
  }
  return async (dispatch) => {
    dispatch(startLoading());
    await axios.get(API + URI)
      .then((response) => {
        switch (type){
          case 'lista':
            dispatch(setUsuarios(response.data.data));
            break;
          default:
            dispatch(setUsuarios(response.data.data));
            break;
        }
      })
      .catch((error) => {
        console.log(error.response);
      });
    dispatch(finishLoading());
  }
}

export const registerUser = (user) => {
  return async (dispatch) => {
    dispatch(startLoading());
    await axios.post(`${API}/users`, user)
      .then((response) => {
        dispatch(getUsuarios('lista'));
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

export const modifyUser = (user) => {
  return async (dispatch) => {
    dispatch(startLoading());
    await axios.put(`${API}/users/${user.id}`, user)
      .then((response) => {
        dispatch(getUsuarios('lista'));
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

export const deleteUser = (user) => {
  return async (dispatch) => {
    dispatch(startLoading());
    await axios.delete(`${API}/users/${user.id}`, user)
      .then((response) => {
        dispatch(getUsuarios('lista'));
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

export const restoreUser = (user) => {
  return async (dispatch) => {
    dispatch(startLoading());
    await axios.post(`${API}/users/${user.id}/restore`, user)
      .then((response) => {
        dispatch(getUsuarios());
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

export const login = (usuario, logged) => ({
  type: types.auth.login,
  payload:{
    usuario,
    logged
  }
});

export const setUsuarios = (usuarios) => ({
  type: types.usuarios.setUsuarios,
  payload: {
    usuarios
  }
});

export const setUsuario = (usuario) => ({
  type: types.usuarios.setUsuario,
  payload: {
    usuario
  }
});

export const setError = (error) => ({
  type: types.usuarios.setError,
  payload:{
    error
  }
});

export const resetUsuarios = () => ({ type: types.usuarios.resetModal});
