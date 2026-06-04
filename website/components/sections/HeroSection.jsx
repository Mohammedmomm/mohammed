'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getCategories } from '@/lib/api'
import { useLanguage } from '@/context/LanguageContext'
import { getName } from '@/lib/utils'

export default function HeroSection() {
  const { lang } = useLanguage()
  const [categories, setCategories] = useState([])

  useEffect(() => {
    getCategories()
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.categories || []
        setCategories(list.filter((c) => !c.parent_id).slice(0, 10))
      })
      .catch(() => {})
  }, [])

  if (!categories.length) return null

  return (
    <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap gap-2">
      {categories.map((cat) => (
        <Link
          key={cat._id || cat.id}
          href={`/category/${cat.slug}`}
          className="px-3 py-1.5 rounded-full text-xs font-medium border border-gray-300 bg-white hover:border-orange-400 hover:text-orange-500 transition-colors"
          style={{ color: '#565959' }}
        >
          {getName(cat, lang)}
        </Link>
      ))}
    </div>
  )
}
