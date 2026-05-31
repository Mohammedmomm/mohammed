import { create } from 'zustand'

const STORAGE_KEY = 'scz-auth'

const getInitialState = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (e) {}
  return { token: null, admin: null, isAuthenticated: false }
}

const useAuthStore = create((set) => ({
  ...getInitialState(),

  login: (token, admin) => {
    const state = { token, admin, isAuthenticated: true }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    set(state)
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEY)
    set({ token: null, admin: null, isAuthenticated: false })
  },
}))

export default useAuthStore
