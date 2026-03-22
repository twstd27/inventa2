import { API, types } from '../types/types'
import axios from 'axios'
import { finishLoading, startLoading, uiCloseDialog, uiCloseModal } from './uiAction'
import { errorResponse } from '../helpers/global'

export const getTiposDeCambio = (type = '') => {
  const URI = type === 'combo' ? '/exchangerates/combo' : '/exchangerates'
  return async (dispatch) => {
    try {
      const response = await axios.get(API + URI)
      if (type === 'combo') {
        dispatch(setTiposDeCambioCombo(response.data.data))
      } else {
        dispatch(setTiposDeCambio(response.data.data))
      }
      return response.data.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}

export const registerTipoDeCambio = (data) => {
  return async (dispatch) => {
    dispatch(startLoading())
    await axios
      .post(`${API}/exchangerates`, data)
      .then(() => {
        dispatch(getTiposDeCambio())
        dispatch(setError({ status: '', message: '', errors: [] }))
        dispatch(uiCloseModal())
      })
      .catch((error) => {
        dispatch(setError(errorResponse(error)))
      })
    dispatch(finishLoading())
  }
}

export const modifyTipoDeCambio = (data) => {
  return async (dispatch) => {
    dispatch(startLoading())
    await axios
      .put(`${API}/exchangerates/${data.id}`, data)
      .then(() => {
        dispatch(getTiposDeCambio())
        dispatch(setError({ status: '', message: '', errors: [] }))
        dispatch(uiCloseModal())
      })
      .catch((error) => {
        dispatch(setError(errorResponse(error)))
      })
    dispatch(finishLoading())
  }
}

export const deleteTipoDeCambio = (item) => {
  return async (dispatch) => {
    dispatch(startLoading())
    await axios
      .delete(`${API}/exchangerates/${item.id}`)
      .then(() => {
        dispatch(getTiposDeCambio())
        dispatch(setError({ status: '', message: '', errors: [] }))
        dispatch(uiCloseDialog())
      })
      .catch((error) => {
        dispatch(setError(errorResponse(error)))
      })
    dispatch(finishLoading())
  }
}

export const restoreTipoDeCambio = (item) => {
  return async (dispatch) => {
    dispatch(startLoading())
    await axios
      .post(`${API}/exchangerates/${item.id}/restore`)
      .then(() => {
        dispatch(getTiposDeCambio())
        dispatch(setError({ status: '', message: '', errors: [] }))
        dispatch(uiCloseDialog())
      })
      .catch((error) => {
        dispatch(setError(errorResponse(error)))
      })
    dispatch(finishLoading())
  }
}

export const setTiposDeCambio = (tiposDeCambio) => ({
  type: types.tipoDeCambio.setTiposDeCambio,
  payload: { tiposDeCambio },
})

export const setTiposDeCambioCombo = (tiposDeCambio) => ({
  type: types.tipoDeCambio.setTiposDeCambioCombo,
  payload: { tiposDeCambio },
})

export const setTipoDeCambio = (tipoDeCambio) => ({
  type: types.tipoDeCambio.setTipoDeCambio,
  payload: { tipoDeCambio },
})

export const setError = (error) => ({
  type: types.tipoDeCambio.setError,
  payload: { error },
})

export const resetTipoDeCambio = () => ({ type: types.tipoDeCambio.resetModal })
