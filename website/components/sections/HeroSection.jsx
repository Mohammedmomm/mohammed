'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import { getCategories } from '@/lib/api'
import { useLanguage } from '@/context/LanguageContext'
import { getName } from '@/lib/utils'
import SearchBar from '@/components/search/SearchBar'

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

  return (
    <section
      className="circuit-pattern py-16 px-4 relative overflow-hidden"
      style={{ backgroundColor: '#0A1628' }}
    >
      {/* Glow effects */}
      <div
        className="absolute top-0 start-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ backgroundColor: '#00D4FF' }}
      />
      <div
        className="absolute bottom-0 end-1/4 w-64 h-64 rounded-full opacity-5 blur-3xl pointer-events-none"
        style={{ backgroundColor: '#FFD700' }}
      />

      <div className="max-w-3xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#00D4FF', color: '#0A1628' }}
            >
              <Zap size={24} />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-3" style={{ color: '#F8F9FA' }}>
            Syria Cable Zone
          </h1>
          <p className="text-base sm:text-lg mb-8" style={{ color: '#94A3B8' }}>
            {lang === 'ar'
              ? 'كتالوج شامل للقطع الإلكترونية والكابلات في سوريا'
              : 'The complete catalog for electronic parts and cables in Syria'}
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-xl mx-auto mb-8"
        >
          <SearchBar />
        </motion.div>

        {/* Category pills */}
        {categories.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-2"
          >
            {categories.map((cat) => (
              <Link
                key={cat._id || cat.id}
                href={`/category/${cat.slug}`}
                className="px-3 py-1.5 rounded-full text-sm font-medium transition-all hover:scale-105"
                style={{
                  backgroundColor: '#162440',
                  color: '#94A3B8',
                  border: '1px solid #1e2d4a',
                }}
              >
                {getName(cat, lang)}
              </Link>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  )
}
