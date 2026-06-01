'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { getName } from '@/lib/utils'

export default function ProductFilters({ filters = {}, onChange, brands = [] }) {
  const { lang } = useLanguage()
  const [mobileOpen, setMobileOpen] = useState(false)

  function update(key, value) {
    onChange({ ...filters, [key]: value, page: 1 })
  }

  const sortOptions = [
    { value: '', label: lang === 'ar' ? 'الأحدث' : 'Newest' },
    { value: 'price_asc', label: lang === 'ar' ? 'السعر: من الأقل' : 'Price: Low to High' },
    { value: 'price_desc', label: lang === 'ar' ? 'السعر: من الأعلى' : 'Price: High to Low' },
    { value: 'name_asc', label: lang === 'ar' ? 'الاسم أ-ي' : 'Name A-Z' },
  ]

  const filterContent = (
    <div className="space-y-6">
      {/* Sort */}
      <div>
        <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: '#94A3B8' }}>
          {lang === 'ar' ? 'الترتيب' : 'Sort By'}
        </label>
        <select
          value={filters.sort || ''}
          onChange={(e) => update('sort', e.target.value)}
          className="w-full rounded-lg px-3 py-2 text-sm outline-none"
          style={{ backgroundColor: '#162440', color: '#F8F9FA', border: '1px solid #1e2d4a' }}
        >
          {sortOptions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Availability */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={!!filters.available_only}
            onChange={(e) => update('available_only', e.target.checked ? true : undefined)}
            className="rounded"
            style={{ accentColor: '#00D4FF' }}
          />
          <span className="text-sm" style={{ color: '#F8F9FA' }}>
            {lang === 'ar' ? 'المتوفر فقط' : 'In Stock Only'}
          </span>
        </label>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: '#94A3B8' }}>
          {lang === 'ar' ? 'نطاق السعر (ل.س)' : 'Price Range (SYP)'}
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder={lang === 'ar' ? 'من' : 'Min'}
            value={filters.min_price || ''}
            onChange={(e) => update('min_price', e.target.value)}
            className="w-full rounded-lg px-3 py-2 text-sm outline-none"
            style={{ backgroundColor: '#162440', color: '#F8F9FA', border: '1px solid #1e2d4a' }}
          />
          <span style={{ color: '#94A3B8' }}>-</span>
          <input
            type="number"
            placeholder={lang === 'ar' ? 'إلى' : 'Max'}
            value={filters.max_price || ''}
            onChange={(e) => update('max_price', e.target.value)}
            className="w-full rounded-lg px-3 py-2 text-sm outline-none"
            style={{ backgroundColor: '#162440', color: '#F8F9FA', border: '1px solid #1e2d4a' }}
          />
        </div>
      </div>

      {/* Brands */}
      {brands.length > 0 && (
        <div>
          <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: '#94A3B8' }}>
            {lang === 'ar' ? 'الماركات' : 'Brands'}
          </label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {brands.map((brand) => (
              <label key={brand._id || brand.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.brand === (brand._id || brand.id)}
                  onChange={(e) =>
                    update('brand', e.target.checked ? (brand._id || brand.id) : undefined)
                  }
                  style={{ accentColor: '#00D4FF' }}
                />
                <span className="text-sm" style={{ color: '#F8F9FA' }}>
                  {getName(brand, lang)}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Reset */}
      <button
        onClick={() => onChange({})}
        className="w-full py-2 rounded-lg text-sm font-medium transition-colors"
        style={{ backgroundColor: '#162440', color: '#94A3B8', border: '1px solid #1e2d4a' }}
      >
        {lang === 'ar' ? 'إعادة تعيين' : 'Reset Filters'}
      </button>
    </div>
  )

  return (
    <>
      {/* Mobile toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium w-full"
          style={{ backgroundColor: '#0F1E35', border: '1px solid #162440', color: '#F8F9FA' }}
        >
          <SlidersHorizontal size={16} style={{ color: '#00D4FF' }} />
          <span className="flex-1 text-start">
            {lang === 'ar' ? 'الفلاتر' : 'Filters'}
          </span>
          {mobileOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {mobileOpen && (
          <div
            className="mt-2 p-4 rounded-xl"
            style={{ backgroundColor: '#0F1E35', border: '1px solid #162440' }}
          >
            {filterContent}
          </div>
        )}
      </div>

      {/* Desktop sidebar */}
      <div
        className="hidden lg:block p-4 rounded-xl"
        style={{ backgroundColor: '#0F1E35', border: '1px solid #162440' }}
      >
        <h3 className="font-bold text-base mb-4 flex items-center gap-2" style={{ color: '#F8F9FA' }}>
          <SlidersHorizontal size={16} style={{ color: '#00D4FF' }} />
          {lang === 'ar' ? 'الفلاتر' : 'Filters'}
        </h3>
        {filterContent}
      </div>
    </>
  )
}
