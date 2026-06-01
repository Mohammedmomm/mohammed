'use client'

import { useEffect, useState, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { getSimilarProducts } from '@/lib/api'
import { useLanguage } from '@/context/LanguageContext'
import { useCurrency } from '@/context/CurrencyContext'
import ProductCard from './ProductCard'

export default function SimilarProducts({ productId }) {
  const { lang, dir } = useLanguage()
  const { currency, exchangeRate } = useCurrency()
  const [products, setProducts] = useState([])
  const scrollRef = useRef(null)

  useEffect(() => {
    if (!productId) return
    getSimilarProducts(productId)
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.products || []
        setProducts(list)
      })
      .catch(() => {})
  }, [productId])

  if (!products.length) return null

  function scroll(direction) {
    const el = scrollRef.current
    if (!el) return
    const amount = 300
    el.scrollBy({ left: direction === 'next' ? amount : -amount, behavior: 'smooth' })
  }

  return (
    <section className="mt-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold" style={{ color: '#F8F9FA' }}>
          {lang === 'ar' ? 'منتجات مشابهة' : 'Similar Products'}
        </h2>
        <div className="flex gap-1">
          <button
            onClick={() => scroll(dir === 'rtl' ? 'next' : 'prev')}
            className="p-1.5 rounded-lg transition-colors"
            style={{ backgroundColor: '#162440', color: '#94A3B8' }}
          >
            <ChevronRight size={18} />
          </button>
          <button
            onClick={() => scroll(dir === 'rtl' ? 'prev' : 'next')}
            className="p-1.5 rounded-lg transition-colors"
            style={{ backgroundColor: '#162440', color: '#94A3B8' }}
          >
            <ChevronLeft size={18} />
          </button>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto hide-scrollbar pb-2"
      >
        {products.map((product) => (
          <div
            key={product._id || product.id}
            className="shrink-0"
            style={{ width: 200 }}
          >
            <ProductCard
              product={product}
              lang={lang}
              currency={currency}
              exchangeRate={exchangeRate}
            />
          </div>
        ))}
      </div>
    </section>
  )
}
