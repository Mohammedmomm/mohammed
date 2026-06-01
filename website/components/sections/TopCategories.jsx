import Link from 'next/link'
import { Grid3X3, ArrowLeft } from 'lucide-react'
import CategoryCard from '@/components/categories/CategoryCard'

export default function TopCategories({ categories = [], lang = 'ar' }) {
  if (!categories.length) return null

  return (
    <section className="py-10 px-4" style={{ backgroundColor: '#0F1E35' }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2" style={{ color: '#F8F9FA' }}>
            <Grid3X3 size={22} style={{ color: '#00D4FF' }} />
            {lang === 'ar' ? 'أبرز التصنيفات' : 'Top Categories'}
          </h2>
          <Link
            href="/categories"
            className="flex items-center gap-1 text-sm font-medium transition-opacity hover:opacity-80"
            style={{ color: '#00D4FF' }}
          >
            {lang === 'ar' ? 'جميع التصنيفات' : 'All Categories'}
            <ArrowLeft size={15} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {categories.slice(0, 8).map((cat, i) => (
            <CategoryCard key={cat._id || cat.id} category={cat} lang={lang} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
