import Link from 'next/link'
import ProductGrid from '@/components/products/ProductGrid'

export default function FeaturedProducts({ products = [], lang = 'ar', currency = 'SYP', exchangeRate }) {
  if (!products.length) return null

  return (
    <section className="py-4 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-md p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold" style={{ color: '#0F1111' }}>
              {lang === 'ar' ? 'المنتجات المميزة' : 'Featured Products'}
            </h2>
            <Link href="/featured" className="text-sm font-medium hover:underline" style={{ color: '#007185' }}>
              {lang === 'ar' ? 'عرض الكل' : 'See all'}
            </Link>
          </div>
          <ProductGrid products={products} lang={lang} currency={currency} exchangeRate={exchangeRate} />
        </div>
      </div>
    </section>
  )
}
