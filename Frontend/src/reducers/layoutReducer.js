import { types } from '../types/types'

const initialState = {
  sidebarShow: isMobileOrSmallScreen() ? false : true,
  theme: localStorage.getItem('coreui-free-react-admin-template-theme') || 'light',
  sidebarUnfoldable: false,
}

function isMobileOrSmallScreen() {
  if (typeof window !== 'undefined') {
    const width = window.innerWidth
    return width < 768
  }
  return false
}

export const layoutReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.layout.toggleSidebar: {
      return {
        ...state,
        sidebarShow: action.payload.show,
      }
    }
    case types.layout.changeTheme:
      return {
        ...state,
        theme: action.payload.theme,
      }
    default:
      return state
  }
}
