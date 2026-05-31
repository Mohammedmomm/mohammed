import { useState, useCallback } from 'react'
import { getProducts } from '../api/products'
import toast from 'react-hot-toast'

const useProducts = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0 })
  const [filters, setFilters] = useState({
    search: '',
    category_id: '',
    brand_id: '',
    is_available: '',
    is_featured: '',
    sort: 'created_at:desc',
  })

  const fetchProducts = useCallback(async (overrideFilters = {}) => {
    setLoading(true)
    try {
      const params = { ...filters, ...overrideFilters, page: pagination.page, limit: pagination.limit }
      const res = await getProducts(params)
      setProducts(res.data.products || res.data.data || [])
      setPagination((prev) => ({ ...prev, total: res.data.total || 0 }))
    } catch (err) {
      toast.error('فشل تحميل المنتجات')
    } finally {
      setLoading(false)
    }
  }, [filters, pagination.page, pagination.limit])

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setPagination((prev) => ({ ...prev, page: 1 }))
  }

  const setPage = (page) => setPagination((prev) => ({ ...prev, page }))

  return { products, setProducts, loading, pagination, setPage, filters, updateFilter, fetchProducts }
}

export default useProducts
