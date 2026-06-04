'use client'

import Link from 'next/link'
import { Layers } from 'lucide-react'
import { getName } from '@/lib/utils'

export default function CategoryCard({ category, lang = 'ar', index = 0 }) {
  if (!category) return null

  const name = getName(category, lang)
  const productCount = category.product_count || 0

  return (
    <Link
      href={`/category/${category.slug}`}
      className="block bg-white rounded-md p-3 border border-gray-200 hover:border-orange-400 hover:shadow-md transition-all duration-200 group text-center"
    >
      <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-2 bg-orange-50 group-hover:bg-orange-100 transition-colors">
        {category.icon ? (
          <span className="text-2xl">{category.icon}</span>
        ) : (
          <Layers size={22} style={{ color: '#FF9900' }} />
        )}
      </div>
      <h3 className="font-semibold text-sm line-clamp-2 mb-1" style={{ color: '#0F1111' }}>
        {name}
      </h3>
      {productCount > 0 && (
        <span className="text-xs" style={{ color: '#007185' }}>
          {lang === 'ar' ? `${productCount} منتج` : `${productCount} items`}
        </span>
      )}
    </Link>
  )
}
