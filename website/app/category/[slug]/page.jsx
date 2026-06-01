'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { getCategoryBySlug, getCategoryProducts, getBrands } from '@/lib/api'
import { useLanguage } from '@/context/LanguageContext'
import { useCurrency } from '@/context/CurrencyContext'
import { getName } from '@/lib/utils'
import Breadcrumb from '@/components/layout/Breadcrumb'
import ProductGrid from '@/components/products/ProductGrid'
import ProductFilters from '@/components/products/ProductFilters'
import Pagination from '@/components/ui/Pagination'
import CategoryTopAd from '@/components/ads/CategoryTopAd'
import SidebarAd from '@/components/ads/SidebarAd'

export default function CategoryPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { lang } = useLanguage()
  const { currency, exchangeRate } = useCurrency()

  const [category, setCategory] = useState(null)
  const [products, setProducts] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [brands, setBrands] = useState([])

  const [filters, setFilters] = useState(() => ({
    brand: searchParams.get('brand') || undefined,
    min_price: searchParams.get('min_price') || undefined,
    max_price: searchParams.get('max_price') || undefined,
    sort: searchParams.get('sort') || '',
    page: Number(searchParams.get('page')) || 1,
    q: searchParams.get('q') || undefined,
    available_only: searchParams.get('available_only') ? true : undefined,
  }))

  const limit = 20

  useEffect(() => {
    getBrands().then((d) => setBrands(Array.isArray(d) ? d : d?.brands || [])).catch(() => {})
  }, [])

  useEffect(() => {
    getCategoryBySlug(params.slug)
      .then((d) => setCategory(d))
      .catch(() => {})
  }, [params.slug])

  useEffect(() => {
    setLoading(true)
    const cleanFilters = {}
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== '' && v !== null) cleanFilters[k] = v
    })
    getCategoryProducts(params.slug, { ...cleanFilters, limit })
      .then((d) => {
        setProducts(Array.isArray(d) ? d : d?.products || [])
        setTotal(d?.total || 0)
      })
      .catch(() => { setProducts([]); setTotal(0) })
      .finally(() => setLoading(false))
  }, [params.slug, filters])

  function handleFiltersChange(newFilters) {
    setFilters(newFilters)
    // Update URL
    const params2 = new URLSearchParams()
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v !== undefined && v !== '' && v !== null) params2.set(k, v)
    })
    router.push(`?${params2.toString()}`, { scroll: false })
  }

  const categoryName = category ? getName(category, lang) : ''

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0A1628' }}>
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="mb-4">
          <Breadcrumb
            items={[
              { label: lang === 'ar' ? 'الرئيسية' : 'Home', href: '/' },
              { label: lang === 'ar' ? 'التصنيفات' : 'Categories', href: '/categories' },
              { label: categoryName || params.slug, href: '#' },
            ]}
          />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold mb-4" style={{ color: '#F8F9FA' }}>
          {categoryName || params.slug}
        </h1>

        {/* Top ad */}
        <CategoryTopAd />

        {/* Main content */}
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <ProductFilters
              filters={filters}
              onChange={handleFiltersChange}
              brands={brands}
            />
            <div className="mt-4">
              <SidebarAd />
            </div>
          </aside>

          {/* Products */}
          <div className="flex-1 min-w-0">
            {/* Mobile filters */}
            <ProductFilters
              filters={filters}
              onChange={handleFiltersChange}
              brands={brands}
            />

            {/* Count */}
            {!loading && (
              <p className="text-sm mb-4" style={{ color: '#94A3B8' }}>
                {lang === 'ar' ? `${total} منتج` : `${total} products`}
              </p>
            )}

            <ProductGrid
              products={products}
              loading={loading}
              lang={lang}
              currency={currency}
              exchangeRate={exchangeRate}
            />

            <Pagination
              page={filters.page || 1}
              total={total}
              limit={limit}
              onChange={(p) => handleFiltersChange({ ...filters, page: p })}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
