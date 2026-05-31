import axiosInstance from './axiosInstance'

export const getTemplates = (categoryId) =>
  axiosInstance.get('/spec-templates', { params: { categoryId } })
export const createTemplate = (data) => axiosInstance.post('/spec-templates', data)
export const updateTemplate = (id, data) => axiosInstance.put(`/spec-templates/${id}`, data)
export const deleteTemplate = (id) => axiosInstance.delete(`/spec-templates/${id}`)
export const getProductSpecs = (productId) =>
  axiosInstance.get(`/products/${productId}/specs`)
export const setProductSpecs = (productId, data) =>
  axiosInstance.put(`/products/${productId}/specs`, data)
