import axiosInstance from './axiosInstance'

export const getCurrent = () => axiosInstance.get('/exchange-rate/current')
export const getHistory = () => axiosInstance.get('/exchange-rate/history')
export const update = (data) => axiosInstance.post('/exchange-rate/update', data)
