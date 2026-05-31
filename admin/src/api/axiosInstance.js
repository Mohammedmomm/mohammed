import axios from 'axios'
import toast from 'react-hot-toast'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 15000,
})

axiosInstance.interceptors.request.use(
  (config) => {
    try {
      const stored = localStorage.getItem('scz-auth')
      if (stored) {
        const { token } = JSON.parse(stored)
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
      }
    } catch (e) {}
    return config
  },
  (error) => Promise.reject(error)
)

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('scz-auth')
      window.location.href = '/login'
      return Promise.reject(error)
    }
    if (!error.response) {
      toast.error('خطأ في الاتصال بالخادم')
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
