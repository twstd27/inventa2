import { API, types } from '../types/types'
import axios from 'axios'
import { finishLoading, startLoading } from './uiAction'
import { errorResponse } from '../helpers/global'

export const getParams = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`${API}/params`)
      dispatch(setParams(response.data.data))
      return response.data.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}

export const modifyParam = (id, value) => {
  return async (dispatch) => {
    dispatch(startLoading())
    await axios
      .put(`${API}/params/${id}`, value)
      .then((response) => {
        dispatch(
          setError({
            status: '',
            message: '',
            errors: [],
          }),
        )
      })
      .catch((error) => {
        const err = errorResponse(error)
        dispatch(setError(err))
      })
    dispatch(finishLoading())
  }
}

export const setParams = (params) => ({
  type: types.params.setParams,
  payload: {
    params,
  },
})

export const setError = (error) => ({
  type: types.precios.setError,
  payload: {
    error,
  },
})
