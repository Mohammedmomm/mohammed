'use client'

import { useEffect, useState } from 'react'
import { Star } from 'lucide-react'
import { getProducts } from '@/lib/api'
import { useLanguage } from '@/context/LanguageContext'
import { useCurrency } from '@/context/CurrencyContext'
import ProductGrid from '@/components/products/ProductGrid'
import Pagination from '@/components/ui/Pagination'
import Breadcrumb from '@/components/layout/Breadcrumb'

const LIMIT = 20

export default function FeaturedPage() {
  const { lang } = useLanguage()
  const { currency, exchangeRate } = useCurrency()
  const [products, setProducts] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  useEffect(() => {
    fetchData(1)
  }, [])

  function fetchData(p) {
    setLoading(true)
    getProducts({ featured: true, limit: LIMIT, page: p })
      .then((d) => {
        setProducts(Array.isArray(d) ? d : d?.products || [])
        setTotal(d?.total || 0)
      })
      .catch(() => { setProducts([]); setTotal(0) })
      .finally(() => setLoading(false))
  }

  function handlePageChange(p) {
    setPage(p)
    fetchData(p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0A1628' }}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-4">
          <Breadcrumb
            items={[
              { label: lang === 'ar' ? 'الرئيسية' : 'Home', href: '/' },
              { label: lang === 'ar' ? 'المنتجات المميزة' : 'Featured Products', href: '/featured' },
            ]}
          />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 flex items-center gap-2" style={{ color: '#F8F9FA' }}>
          <Star size={26} style={{ color: '#FFD700', fill: '#FFD700' }} />
          {lang === 'ar' ? 'المنتجات المميزة' : 'Featured Products'}
        </h1>
        {!loading && (
          <p className="text-sm mb-6" style={{ color: '#94A3B8' }}>
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
          page={page}
          total={total}
          limit={LIMIT}
          onChange={handlePageChange}
        />
      </div>
    </div>
  )
}
