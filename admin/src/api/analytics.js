import axiosInstance from './axiosInstance'

export const getOverview = () => axiosInstance.get('/analytics/overview')
export const getVisitors = (params) => axiosInstance.get('/analytics/visitors', { params })
export const getVisitorsHourly = () => axiosInstance.get('/analytics/visitors/hourly')
export const getProducts = (params) => axiosInstance.get('/analytics/products', { params })
export const getAds = () => axiosInstance.get('/analytics/ads')
export const getSearches = () => axiosInstance.get('/analytics/searches')
export const getCategories = () => axiosInstance.get('/analytics/categories')
export const getDevices = () => axiosInstance.get('/analytics/devices')
export const getCities = () => axiosInstance.get('/analytics/cities')
