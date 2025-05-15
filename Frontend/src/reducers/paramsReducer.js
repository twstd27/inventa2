import { types } from '../types/types'

const initialState = {
  params: [],
}

export const paramsReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.params.setParams:
      return {
        ...state,
        params: action.payload.params,
      }
    default:
      return state
  }
}
