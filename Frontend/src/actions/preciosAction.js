import { API, types } from '../types/types'
import axios from 'axios'
import { finishLoading, startLoading, uiCloseDialog, uiCloseModal } from './uiAction'
import { errorResponse } from '../helpers/global'

export const getPrecios = (type = '') => {
  const URI = type === 'combo' ? '/pricelists/combo' : '/pricelists'

  return async (dispatch) => {
    try {
      const response = await axios.get(API + URI)
      switch (type) {
        case 'combo':
          dispatch(setPreciosCombo(response.data.data))
          break
        default:
          dispatch(setPrecios(response.data.data))
          break
      }
      return response.data.data // Devuelve los datos para que se pueda usar como promesa
    } catch (error) {
      console.error(error)
      throw error // Lanza el error para manejarlo en el componente
    }
  }
}

export const registerPriceList = (pricelist) => {
  return async (dispatch) => {
    dispatch(startLoading())
    await axios
      .post(`${API}/pricelists`, pricelist)
      .then((response) => {
        dispatch(getPrecios())
        dispatch(
          setError({
            status: '',
            message: '',
            errors: [],
          }),
        )
        dispatch(uiCloseModal())
      })
      .catch((error) => {
        const err = errorResponse(error)
        dispatch(setError(err))
      })
    dispatch(finishLoading())
  }
}

export const modifyPriceList = (pricelist) => {
  return async (dispatch) => {
    dispatch(startLoading())
    await axios
      .put(`${API}/pricelists/${pricelist.id}`, pricelist)
      .then((response) => {
        dispatch(getPrecios())
        dispatch(
          setError({
            status: '',
            message: '',
            errors: [],
          }),
        )
        dispatch(uiCloseModal())
      })
      .catch((error) => {
        const err = errorResponse(error)
        dispatch(setError(err))
      })
    dispatch(finishLoading())
  }
}

export const deletePriceList = (pricelist) => {
  return async (dispatch) => {
    dispatch(startLoading())
    await axios
      .delete(`${API}/pricelists/${pricelist.id}`, pricelist)
      .then((response) => {
        dispatch(getPrecios())
        dispatch(
          setError({
            status: '',
            message: '',
            errors: [],
          }),
        )
        dispatch(uiCloseDialog())
      })
      .catch((error) => {
        const err = errorResponse(error)
        dispatch(setError(err))
      })
    dispatch(finishLoading())
  }
}

export const restorePriceList = (pricelist) => {
  return async (dispatch) => {
    dispatch(startLoading())
    await axios
      .post(`${API}/pricelists/${pricelist.id}/restore`, pricelist)
      .then((response) => {
        dispatch(getPrecios())
        dispatch(
          setError({
            status: '',
            message: '',
            errors: [],
          }),
        )
        dispatch(uiCloseDialog())
      })
      .catch((error) => {
        const err = errorResponse(error)
        dispatch(setError(err))
      })
    dispatch(finishLoading())
  }
}

export const setPrecios = (precios) => ({
  type: types.precios.setPrecios,
  payload: {
    precios,
  },
})

export const setPreciosCombo = (precios) => ({
  type: types.precios.setPreciosCombo,
  payload: {
    precios,
  },
})

export const setPrecio = (precio) => ({
  type: types.precios.setPrecio,
  payload: {
    precio,
  },
})

export const setError = (error) => ({
  type: types.precios.setError,
  payload: {
    error,
  },
})

export const resetPrecios = () => ({ type: types.precios.resetModal })
