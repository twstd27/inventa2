import {API, types} from "../types/types";
import axios from "axios";
import {finishLoading, startLoading, uiCloseDialog, uiCloseModal} from "./uiAction";
import {errorResponse} from "../helpers/global";

export const getProductos = (type = '', data = {}) => {
  let URI = '';
  switch (type){
    case 'combo': URI = '/products/combo'; break;
    case 'busqueda': URI = `/products?q=${data.buscar}&b=${data.sucursal}`; break;
    default: URI = '/products/lista'; break;
  }
  return async (dispatch) => {
    dispatch(startLoading());
    await axios.get(API + URI)
      .then((response) => {
        switch (type){
          case 'combo':
            dispatch(setProductosCombo(response.data.data));
            break;
          default:
            dispatch(setProductos(response.data.data));
            break;
        }
      })
      .catch((error) => {
        console.log(error.response);
      });
    dispatch(finishLoading());
  }
}

export const registerProduct = (product, files) => {
  return async (dispatch) => {
    dispatch(startLoading());
    await axios.post(`${API}/products`, product)
      .then(async (response) => {
        if(response.status === 201){
          const config = {
            fileKey: 'image',
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          };
          for( let i = 0; i < files.length; i++){
            const formData = new FormData();
            formData.append("image", files[i]);
            await axios.post(`${API}/products/${response.data.data.id}/uploadimg`, formData, config);
          }
          dispatch(getProductos());
          dispatch(setError({
            status: '',
            message: '',
            errors: []
          }));
        }
        dispatch(uiCloseModal());
      })
      .catch((error) => {
        console.log(error.response);
        const err = errorResponse(error);
        dispatch(setError(err));
      });
    dispatch(finishLoading());
  }
}

export const modifyProduct = (product, files, deletefiles) => {
  return async (dispatch) => {
    dispatch(startLoading());
    await axios.put(`${API}/products/${product.id}`, product)
      .then(async (response) => {
        if(response.status === 200){
          const config = {
            fileKey: 'image',
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          };

          for( let i = 0; i < deletefiles.length; i++){
            await axios.post(`${API}/products/${response.data.data.id}/deleteimg`, deletefiles[i]);
          }

          for( let i = 0; i < files.length; i++){
            const formData = new FormData();
            formData.append("image", files[i]);
            await axios.post(`${API}/products/${response.data.data.id}/uploadimg`, formData, config);
          }

          dispatch(getProductos());
          dispatch(setError({
            status: '',
            message: '',
            errors: []
          }));
        }
        dispatch(uiCloseModal());
      })
      .catch((error) => {
        console.log(error.response);
        const err = errorResponse(error);
        dispatch(setError(err));
      });
    dispatch(finishLoading());
  }
}

export const deleteProduct = (product) => {
  return async (dispatch) => {
    dispatch(startLoading());
    await axios.delete(`${API}/products/${product.id}`, product)
      .then((response) => {
        dispatch(getProductos());
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

export const restoreProduct = (product) => {
  return async (dispatch) => {
    dispatch(startLoading());
    await axios.post(`${API}/products/${product.id}/restore`, product)
      .then((response) => {
        dispatch(getProductos());
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

export const setProductos = (productos) => ({
  type: types.productos.setProductos,
  payload: {
    productos
  }
});

export const setProductosCombo = (productos) => ({
  type: types.productos.setProductosCombo,
  payload: {
    productos
  }
});

export const setProducto = (producto) => ({
  type: types.productos.setProducto,
  payload: {
    producto
  }
});

export const setError = (error) => ({
  type: types.productos.setError,
  payload:{
    error
  }
});

export const resetProductos = () => ({ type: types.productos.resetModal});

export const resetProductosLista = () => ({ type: types.productos.resetProductos});
