import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error)
  }
)

// Categories
export async function getCategories() {
  const res = await api.get('/categories/tree')
  return res.data?.data || []
}

export async function getCategoryBySlug(slug) {
  const res = await api.get(`/categories/slug/${slug}`)
  return res.data?.data
}

export async function getCategoryProducts(slug, params = {}) {
  const res = await api.get(`/categories/slug/${slug}/products`, { params })
  const d = res.data?.data
  return {
    products: d?.data || [],
    total: d?.pagination?.total || 0,
    pagination: d?.pagination,
  }
}

// Products
export async function getProducts(params = {}) {
  const { q, ...rest } = params
  const apiParams = { ...rest }
  if (q) apiParams.search = q
  const res = await api.get('/products', { params: apiParams })
  const d = res.data?.data
  return {
    products: d?.data || [],
    total: d?.pagination?.total || 0,
    pagination: d?.pagination,
  }
}

export async function getProduct(id) {
  const res = await api.get(`/products/${id}`)
  return res.data?.data
}

export async function getProductBySlug(slug) {
  const res = await api.get(`/products/slug/${slug}`)
  return res.data?.data
}

export async function getSimilarProducts(id) {
  const res = await api.get(`/products/${id}/similar`)
  return res.data?.data || []
}

// Brands — fetch all
export async function getBrands() {
  const res = await api.get('/brands', { params: { limit: 100 } })
  return res.data?.data?.data || []
}

// Ads
export async function getAds(position) {
  const res = await api.get('/ads', { params: { position } })
  return res.data?.data || []
}

// Settings (public)
export async function getSettings() {
  const res = await api.get('/settings/public')
  return res.data?.data || {}
}

// Exchange rate
export async function getExchangeRate() {
  const res = await api.get('/exchange-rate/current')
  return res.data?.data
}

// Analytics stubs (backend not yet implemented)
export async function trackPageView() {}
export async function trackSearch() {}
export async function trackProductView() {}
export async function trackAdClick() {}

export default api
