import axiosInstance from './axiosInstance'

export const getTree = () => axiosInstance.get('/categories/tree')
export const getFlat = () => axiosInstance.get('/categories/flat')
export const getById = (id) => axiosInstance.get(`/categories/${id}`)
export const create = (data) => axiosInstance.post('/categories', data)
export const update = (id, data) => axiosInstance.put(`/categories/${id}`, data)
export const remove = (id) => axiosInstance.delete(`/categories/${id}`)
export const reorder = (data) => axiosInstance.post('/categories/reorder', data)
