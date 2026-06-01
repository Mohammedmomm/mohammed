import Link from 'next/link'
import { Star, ArrowLeft } from 'lucide-react'
import ProductGrid from '@/components/products/ProductGrid'

export default function FeaturedProducts({ products = [], lang = 'ar', currency = 'SYP', exchangeRate }) {
  if (!products.length) return null

  return (
    <section className="py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2" style={{ color: '#F8F9FA' }}>
            <Star size={22} style={{ color: '#FFD700', fill: '#FFD700' }} />
            {lang === 'ar' ? 'المنتجات المميزة' : 'Featured Products'}
          </h2>
          <Link
            href="/featured"
            className="flex items-center gap-1 text-sm font-medium transition-opacity hover:opacity-80"
            style={{ color: '#00D4FF' }}
          >
            {lang === 'ar' ? 'عرض الكل' : 'View All'}
            <ArrowLeft size={15} />
          </Link>
        </div>
        <ProductGrid
          products={products}
          lang={lang}
          currency={currency}
          exchangeRate={exchangeRate}
        />
      </div>
    </section>
  )
}
