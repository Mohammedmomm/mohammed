'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { getName } from '@/lib/utils'

export default function BrandsStrip({ brands = [] }) {
  const { lang, dir } = useLanguage()
  const scrollRef = useRef(null)

  if (!brands.length) return null

  function scroll(direction) {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: direction === 'next' ? 200 : -200, behavior: 'smooth' })
  }

  return (
    <section className="py-8 px-4" style={{ backgroundColor: '#162440' }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold" style={{ color: '#94A3B8' }}>
            {lang === 'ar' ? 'الماركات' : 'Brands'}
          </h2>
          <div className="flex gap-1">
            <button
              onClick={() => scroll(dir === 'rtl' ? 'next' : 'prev')}
              className="p-1.5 rounded-lg"
              style={{ backgroundColor: '#0F1E35', color: '#94A3B8' }}
            >
              <ChevronRight size={16} />
            </button>
            <button
              onClick={() => scroll(dir === 'rtl' ? 'prev' : 'next')}
              className="p-1.5 rounded-lg"
              style={{ backgroundColor: '#0F1E35', color: '#94A3B8' }}
            >
              <ChevronLeft size={16} />
            </button>
          </div>
        </div>
        <div ref={scrollRef} className="flex gap-4 overflow-x-auto hide-scrollbar pb-1">
          {brands.map((brand) => (
            <div
              key={brand._id || brand.id}
              className="shrink-0 flex items-center justify-center rounded-xl px-6 py-3 transition-all hover:scale-105"
              style={{
                backgroundColor: '#0F1E35',
                border: '1px solid #1e2d4a',
                minWidth: 120,
                height: 64,
              }}
            >
              {brand.logo_url ? (
                <Image
                  src={brand.logo_url}
                  alt={getName(brand, lang)}
                  width={80}
                  height={40}
                  className="object-contain opacity-70 hover:opacity-100 transition-opacity"
                  style={{ maxHeight: 40 }}
                />
              ) : (
                <span className="text-sm font-semibold" style={{ color: '#94A3B8' }}>
                  {getName(brand, lang)}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
