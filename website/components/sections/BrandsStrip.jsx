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
    <section className="py-4 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-md p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold" style={{ color: '#0F1111' }}>
              {lang === 'ar' ? 'الماركات' : 'Brands'}
            </h2>
            <div className="flex gap-1">
              <button onClick={() => scroll(dir === 'rtl' ? 'next' : 'prev')}
                className="p-1.5 rounded border border-gray-300 hover:bg-gray-100 transition-colors">
                <ChevronRight size={15} style={{ color: '#565959' }} />
              </button>
              <button onClick={() => scroll(dir === 'rtl' ? 'prev' : 'next')}
                className="p-1.5 rounded border border-gray-300 hover:bg-gray-100 transition-colors">
                <ChevronLeft size={15} style={{ color: '#565959' }} />
              </button>
            </div>
          </div>
          <div ref={scrollRef} className="flex gap-3 overflow-x-auto hide-scrollbar pb-1">
            {brands.map((brand) => (
              <div key={brand._id || brand.id}
                className="shrink-0 flex items-center justify-center rounded border border-gray-200 bg-white hover:border-orange-400 hover:shadow-sm transition-all px-5 py-3"
                style={{ minWidth: 110, height: 60 }}
              >
                {brand.logo_url ? (
                  <Image src={brand.logo_url} alt={getName(brand, lang)}
                    width={80} height={36} className="object-contain" style={{ maxHeight: 36 }} />
                ) : (
                  <span className="text-sm font-semibold" style={{ color: '#565959' }}>
                    {getName(brand, lang)}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
