import Link from 'next/link'
import CategoryCard from '@/components/categories/CategoryCard'

export default function TopCategories({ categories = [], lang = 'ar' }) {
  if (!categories.length) return null

  return (
    <section className="py-6 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-md p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold" style={{ color: '#0F1111' }}>
              {lang === 'ar' ? 'تسوّق حسب التصنيف' : 'Shop by Category'}
            </h2>
            <Link href="/categories" className="text-sm font-medium hover:underline" style={{ color: '#007185' }}>
              {lang === 'ar' ? 'جميع التصنيفات' : 'See all'}
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
            {categories.slice(0, 8).map((cat, i) => (
              <CategoryCard key={cat._id || cat.id} category={cat} lang={lang} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
