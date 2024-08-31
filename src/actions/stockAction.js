import { API, types } from '../types/types'
import axios from 'axios'
import { finishLoading, startLoading, uiCloseDialog, uiCloseModal } from './uiAction'
import { errorResponse } from '../helpers/global'

export const getEntradas = (page = 1, limit = 5) => {
  return async (dispatch) => {
    dispatch(startLoading())
    await axios
      .get(`${API}/entries/entradas?page=${page}&limit=${limit}`)
      .then((response) => {
        dispatch(
          setEntradas(
            response.data.data,
            response.data.last_page,
            response.data.total,
            response.data.current_page,
          ),
        )
      })
      .catch((error) => {
        console.log(error.response)
      })
    dispatch(finishLoading())
  }
}

export const getSalidas = () => {
  return async (dispatch) => {
    await axios
      .get(`${API}/entries/salidas`)
      .then((response) => {
        dispatch(setSalidas(response.data.data))
      })
      .catch((error) => {
        console.log(error.response)
      })
  }
}

export const registerEntry = (entry) => {
  return async (dispatch) => {
    dispatch(startLoading())
    await axios
      .post(`${API}/entries`, entry)
      .then((response) => {
        dispatch(getEntradas())
        dispatch(getSalidas())
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

export const modifyEntry = (entry) => {
  return async (dispatch) => {
    dispatch(startLoading())
    await axios
      .put(`${API}/entries/${entry.id}`, entry)
      .then((response) => {
        dispatch(getEntradas())
        dispatch(getSalidas())
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

export const deleteEntry = (entry) => {
  return async (dispatch) => {
    dispatch(startLoading())
    await axios
      .delete(`${API}/entries/${entry.id}`, entry)
      .then((response) => {
        dispatch(getEntradas())
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

export const restoreEntry = (entry) => {
  return async (dispatch) => {
    dispatch(startLoading())
    await axios
      .post(`${API}/entries/${entry.id}/restore`, entry)
      .then((response) => {
        dispatch(getEntradas())
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

export const setEntradas = (entradas, ultimaPagina, totalEntradas, paginaActual) => ({
  type: types.entradas.setEntradas,
  payload: {
    entradas,
    paginaActual,
    ultimaPagina,
    totalEntradas,
  },
})

export const setSalidas = (salidas) => ({
  type: types.salidas.setSalidas,
  payload: {
    salidas,
  },
})

export const setEntrada = (entrada) => ({
  type: types.entradas.setEntrada,
  payload: {
    entrada,
  },
})

export const setError = (error) => ({
  type: types.entradas.setError,
  payload: {
    error,
  },
})

export const resetEntradas = () => ({ type: types.entradas.resetModal })
