'use client'

import { useEffect, useState } from 'react'
import { Sparkles } from 'lucide-react'
import { getProducts } from '@/lib/api'
import { useLanguage } from '@/context/LanguageContext'
import { useCurrency } from '@/context/CurrencyContext'
import ProductGrid from '@/components/products/ProductGrid'
import Pagination from '@/components/ui/Pagination'
import Breadcrumb from '@/components/layout/Breadcrumb'

const LIMIT = 20

export default function NewArrivalsPage() {
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
    getProducts({ sort: 'newest', limit: LIMIT, page: p })
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
              { label: lang === 'ar' ? 'أحدث المنتجات' : 'New Arrivals', href: '/new-arrivals' },
            ]}
          />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 flex items-center gap-2" style={{ color: '#F8F9FA' }}>
          <Sparkles size={26} style={{ color: '#00D4FF' }} />
          {lang === 'ar' ? 'أحدث المنتجات' : 'New Arrivals'}
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
