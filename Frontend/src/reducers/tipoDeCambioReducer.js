import { types } from '../types/types'

const initialState = {
  tiposDeCambio: [],
  tiposDeCambioCombo: [],
  tipoDeCambio: {
    description: '',
    value: 0,
  },
}

export const tipoDeCambioReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.tipoDeCambio.setTiposDeCambio:
      return {
        ...state,
        tiposDeCambio: action.payload.tiposDeCambio,
      }
    case types.tipoDeCambio.setTiposDeCambioCombo:
      return {
        ...state,
        tiposDeCambioCombo: action.payload.tiposDeCambio,
      }
    case types.tipoDeCambio.setTipoDeCambio:
      return {
        ...state,
        tipoDeCambio: action.payload.tipoDeCambio,
      }
    case types.tipoDeCambio.setError:
      return {
        ...state,
        error: action.payload.error,
      }
    case types.tipoDeCambio.resetModal:
      return {
        ...state,
        error: { status: '', message: '', errors: [] },
        tipoDeCambio: { description: '', value: 0 },
      }
    default:
      return state
  }
}
