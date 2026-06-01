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
    // Silently handle errors — callers decide what to do
    return Promise.reject(error)
  }
)

// Categories
export async function getCategories() {
  const res = await api.get('/categories')
  return res.data
}

export async function getCategoryBySlug(slug) {
  const res = await api.get(`/categories/${slug}`)
  return res.data
}

export async function getCategoryProducts(slug, params = {}) {
  const res = await api.get(`/categories/${slug}/products`, { params })
  return res.data
}

// Products
export async function getProducts(params = {}) {
  const res = await api.get('/products', { params })
  return res.data
}

export async function getProduct(id) {
  const res = await api.get(`/products/${id}`)
  return res.data
}

export async function getProductBySlug(slug) {
  const res = await api.get(`/products/slug/${slug}`)
  return res.data
}

export async function getSimilarProducts(id) {
  const res = await api.get(`/products/${id}/similar`)
  return res.data
}

// Brands
export async function getBrands() {
  const res = await api.get('/brands')
  return res.data
}

// Ads
export async function getAds(position) {
  const res = await api.get('/ads', { params: { position } })
  return res.data
}

// Settings
export async function getSettings() {
  const res = await api.get('/settings')
  return res.data
}

// Exchange rate
export async function getExchangeRate() {
  const res = await api.get('/exchange-rate')
  return res.data
}

// Analytics
export async function trackPageView(path, referrer) {
  const res = await api.post('/analytics/pageview', { path, referrer })
  return res.data
}

export async function trackSearch(query, resultsCount) {
  const res = await api.post('/analytics/search', { query, results_count: resultsCount })
  return res.data
}

export async function trackProductView(id) {
  const res = await api.post(`/analytics/product-view/${id}`)
  return res.data
}

export async function trackAdClick(id) {
  const res = await api.post(`/analytics/ad-click/${id}`)
  return res.data
}

export default api
