import axiosInstance from './axiosInstance'

export const getBrands = () => axiosInstance.get('/brands')
export const getBrand = (id) => axiosInstance.get(`/brands/${id}`)
export const create = (data) => axiosInstance.post('/brands', data)
export const update = (id, data) => axiosInstance.put(`/brands/${id}`, data)
export const remove = (id) => axiosInstance.delete(`/brands/${id}`)
export const toggle = (id) => axiosInstance.patch(`/brands/${id}/toggle`)
