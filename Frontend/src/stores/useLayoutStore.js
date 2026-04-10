import { create } from 'zustand'

function isMobileOrSmallScreen() {
  if (typeof window !== 'undefined') return window.innerWidth < 768
  return false
}

export const useLayoutStore = create((set) => ({
  sidebarShow: !isMobileOrSmallScreen(),
  theme: localStorage.getItem('coreui-free-react-admin-template-theme') || 'light',
  sidebarUnfoldable: false,

  toggleSidebar: (show) => set({ sidebarShow: show }),
  changeTheme: (theme) => {
    localStorage.setItem('coreui-free-react-admin-template-theme', theme)
    set({ theme })
  },
}))
