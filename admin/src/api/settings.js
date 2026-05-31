import axiosInstance from './axiosInstance'

export const getSettings = () => axiosInstance.get('/settings')
export const getAdminSettings = () => axiosInstance.get('/settings/admin')
export const updateSettings = (data) => axiosInstance.put('/settings', data)
