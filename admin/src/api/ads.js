import axiosInstance from './axiosInstance'

export const getAds = () => axiosInstance.get('/ads')
export const getActiveAds = () => axiosInstance.get('/ads/active')
export const create = (data) => axiosInstance.post('/ads', data)
export const update = (id, data) => axiosInstance.put(`/ads/${id}`, data)
export const remove = (id) => axiosInstance.delete(`/ads/${id}`)
export const toggle = (id) => axiosInstance.patch(`/ads/${id}/toggle`)
