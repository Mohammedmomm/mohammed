import { create } from 'zustand'

const STORAGE_KEY = 'scz-ui'

const getInitialState = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored)
  } catch (e) {}
  return { sidebarCollapsed: false, lang: localStorage.getItem('scz-lang') || 'ar' }
}

const useUiStore = create((set) => ({
  ...getInitialState(),

  toggleSidebar: () =>
    set((state) => {
      const next = { ...state, sidebarCollapsed: !state.sidebarCollapsed }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return { sidebarCollapsed: !state.sidebarCollapsed }
    }),

  setLang: (lang) =>
    set((state) => {
      const next = { ...state, lang }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      localStorage.setItem('scz-lang', lang)
      return { lang }
    }),
}))

export default useUiStore
