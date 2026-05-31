import axiosInstance from './axiosInstance'

export const login = (username, password) =>
  axiosInstance.post('/auth/login', { username, password })

export const getMe = () => axiosInstance.get('/auth/me')

export const changePassword = (data) =>
  axiosInstance.put('/auth/change-password', data)
