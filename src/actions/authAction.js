import {API, types} from "../types/types";
import axios from 'axios';
import {finishLoading, startLoading} from "./uiAction";

// TODO: hacer persistente el inicio de sesion

export const startLogin = (email, password) => {
  return async (dispatch) => {
    dispatch(startLoading());
    await axios.post(`${API}/login`, {email, password})
      .then((response) => {
        if(response.data.data.status === 'ok'){
          dispatch(login(response.data.data.usuario, true));
          dispatch(setError({
            status: '',
            message: '',
            errors: []
          }));
        }else{
          dispatch(setError({
            status: 422,
            message: response.data.data.message,
            errors: []
          }));
        }
      })
      .catch((error) => {
        console.log(error);
      });
    dispatch(finishLoading());
  }
}

export const startLogout = () => {
  return async (dispatch) => {
    dispatch(logout(false));
  }
}

export const login = (usuario, logged) => ({
  type: types.auth.login,
  payload:{
    usuario,
    logged
  }
});

export const logout = (logged) => ({
  type: types.auth.logout,
  payload:{
    logged
  }
});

export const setError = (error) => ({
  type: types.auth.setError,
  payload:{
    error
  }
});
