'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Layers, ChevronLeft } from 'lucide-react'
import { getName } from '@/lib/utils'

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, delay: i * 0.05 },
  }),
}

export default function CategoryCard({ category, lang = 'ar', index = 0 }) {
  if (!category) return null

  const name = getName(category, lang)
  const subCount = category.children?.length || category.subcategory_count || 0
  const productCount = category.product_count || 0

  return (
    <motion.div
      custom={index}
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.04 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <Link
        href={`/category/${category.slug}`}
        className="block rounded-xl p-4 transition-all duration-200 group"
        style={{
          backgroundColor: '#0F1E35',
          border: '1px solid #162440',
        }}
      >
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-colors group-hover:bg-cyan-DEFAULT/20"
          style={{ backgroundColor: '#162440' }}
        >
          {category.icon ? (
            <span className="text-2xl">{category.icon}</span>
          ) : (
            <Layers size={22} style={{ color: '#00D4FF' }} />
          )}
        </div>
        <h3 className="font-bold text-sm mb-1 line-clamp-2" style={{ color: '#F8F9FA' }}>
          {name}
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-xs" style={{ color: '#94A3B8' }}>
            {productCount > 0
              ? (lang === 'ar' ? `${productCount} منتج` : `${productCount} products`)
              : subCount > 0
              ? (lang === 'ar' ? `${subCount} تصنيف` : `${subCount} sub`)
              : ''}
          </span>
          <ChevronLeft size={14} style={{ color: '#00D4FF' }} />
        </div>
      </Link>
    </motion.div>
  )
}
