import axiosInstance from './axiosInstance'

export const getProducts = (params) => axiosInstance.get('/products', { params })
export const getProduct = (id) => axiosInstance.get(`/products/${id}`)
export const createProduct = (data) => axiosInstance.post('/products', data)
export const updateProduct = (id, data) => axiosInstance.put(`/products/${id}`, data)
export const deleteProduct = (id) => axiosInstance.delete(`/products/${id}`)
export const toggleAvailable = (id) => axiosInstance.patch(`/products/${id}/toggle-available`)
export const toggleFeatured = (id) => axiosInstance.patch(`/products/${id}/toggle-featured`)
export const bulkPriceUpdate = (data) => axiosInstance.post('/products/bulk-price-fixed', data)
export const bulkPricePercent = (data) => axiosInstance.post('/products/bulk-price-percent', data)
export const priceByName = (data) => axiosInstance.post('/products/price-by-name', data)
