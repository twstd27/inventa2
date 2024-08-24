import {API, types} from "../types/types";
import axios from "axios";
import {finishLoading, startLoading, uiCloseDialog, uiCloseModal} from "./uiAction";
import {errorResponse} from "../helpers/global";

export const getRoles = (type = '') => {
  const URI = (type === 'combo') ? '/roles/combo' : '/roles';

  return async (dispatch) => {
    await axios.get(API + URI)
      .then((response) => {
        switch (type){
          case 'combo':
            dispatch(setRolesCombo(response.data.data));
            break;
          default:
            dispatch(setRoles(response.data.data));
            break;
        }
      })
      .catch((error) => {
        // console.log(error.response);
      });
  }
}

export const registerRole = (role) => {
  return async (dispatch) => {
    dispatch(startLoading());
    await axios.post(`${API}/roles`, role)
      .then((response) => {
        dispatch(getRoles());
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

export const modifyRole = (role) => {
  return async (dispatch) => {
    dispatch(startLoading());
    await axios.put(`${API}/roles/${role.id}`, role)
      .then((response) => {
        dispatch(getRoles());
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

export const deleteRole = (role) => {
  return async (dispatch) => {
    dispatch(startLoading());
    await axios.delete(`${API}/roles/${role.id}`, role)
      .then((response) => {
        dispatch(getRoles());
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

export const restoreRole = (role) => {
  return async (dispatch) => {
    dispatch(startLoading());
    await axios.post(`${API}/roles/${role.id}/restore`, role)
      .then((response) => {
        dispatch(getRoles());
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

export const setRoles = (roles) => ({
  type: types.roles.setRoles,
  payload: {
    roles
  }
});

export const setRolesCombo = (roles) => ({
  type: types.roles.setRolesCombo,
  payload: {
    roles
  }
});

export const setRol = (rol) => ({
  type: types.roles.setRol,
  payload: {
    rol
  }
});

export const setError = (error) => ({
  type: types.roles.setError,
  payload:{
    error
  }
});

export const resetRoles = () => ({ type: types.roles.resetModal});
