import { types } from '../types/types'

export const toggleSidebar = (show) => ({
  type: types.layout.toggleSidebar,
  payload: {
    show,
  },
})

export const changeTheme = (theme) => ({
  type: types.layout.changeTheme,
  payload: {
    theme,
  },
})
