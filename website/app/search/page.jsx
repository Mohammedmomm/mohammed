'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'
import { getProducts } from '@/lib/api'
import { trackSearch } from '@/lib/analytics'
import { useLanguage } from '@/context/LanguageContext'
import { useCurrency } from '@/context/CurrencyContext'
import ProductGrid from '@/components/products/ProductGrid'
import Pagination from '@/components/ui/Pagination'
import Breadcrumb from '@/components/layout/Breadcrumb'

const LIMIT = 20

export default function SearchPage() {
  const searchParams = useSearchParams()
  const q = searchParams.get('q') || ''
  const { lang } = useLanguage()
  const { currency, exchangeRate } = useCurrency()
  const [products, setProducts] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)

  useEffect(() => {
    if (!q.trim()) return
    setLoading(true)
    setPage(1)
    getProducts({ q, limit: LIMIT, page: 1 })
      .then((d) => {
        const list = Array.isArray(d) ? d : d?.products || []
        setProducts(list)
        setTotal(d?.total || list.length)
        trackSearch(q, d?.total || list.length)
      })
      .catch(() => { setProducts([]); setTotal(0) })
      .finally(() => setLoading(false))
  }, [q])

  function handlePageChange(p) {
    setPage(p)
    setLoading(true)
    getProducts({ q, limit: LIMIT, page: p })
      .then((d) => {
        setProducts(Array.isArray(d) ? d : d?.products || [])
        setTotal(d?.total || 0)
      })
      .catch(() => { setProducts([]) })
      .finally(() => setLoading(false))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#EAEDED' }}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-4">
          <Breadcrumb
            items={[
              { label: lang === 'ar' ? 'الرئيسية' : 'Home', href: '/' },
              { label: lang === 'ar' ? 'البحث' : 'Search', href: '#' },
            ]}
          />
        </div>

        <div className="flex items-center gap-3 mb-6">
          <Search size={24} style={{ color: '#FF9900' }} />
          <h1 className="text-2xl font-bold" style={{ color: '#0F1111' }}>
            {q
              ? (lang === 'ar' ? `نتائج البحث عن: "${q}"` : `Search results for: "${q}"`)
              : (lang === 'ar' ? 'البحث' : 'Search')}
          </h1>
        </div>

        {!loading && q && (
          <p className="text-sm mb-6" style={{ color: '#565959' }}>
            {lang === 'ar' ? `${total} نتيجة` : `${total} results`}
          </p>
        )}

        {!q ? (
          <div className="text-center py-20" style={{ color: '#565959' }}>
            {lang === 'ar' ? 'أدخل كلمة بحث للبدء' : 'Enter a search term to get started'}
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  )
}
