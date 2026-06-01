'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

export default function Pagination({ page = 1, total = 0, limit = 20, onChange }) {
  const { dir } = useLanguage()
  const totalPages = Math.max(1, Math.ceil(total / limit))
  if (totalPages <= 1) return null

  const PrevIcon = dir === 'rtl' ? ChevronRight : ChevronLeft
  const NextIcon = dir === 'rtl' ? ChevronLeft : ChevronRight

  function buildPages() {
    const pages = []
    const delta = 2
    for (let i = Math.max(1, page - delta); i <= Math.min(totalPages, page + delta); i++) {
      pages.push(i)
    }
    if (pages[0] > 1) {
      pages.unshift('...')
      pages.unshift(1)
    }
    if (pages[pages.length - 1] < totalPages) {
      pages.push('...')
      pages.push(totalPages)
    }
    return pages
  }

  return (
    <div className="flex items-center justify-center gap-1.5 mt-8 flex-wrap">
      <button
        onClick={() => page > 1 && onChange(page - 1)}
        disabled={page <= 1}
        className="p-2 rounded-lg transition-colors disabled:opacity-30"
        style={{ backgroundColor: '#162440', color: '#94A3B8' }}
        aria-label="Previous"
      >
        <PrevIcon size={16} />
      </button>

      {buildPages().map((p, i) =>
        p === '...' ? (
          <span key={`dot-${i}`} className="px-2" style={{ color: '#94A3B8' }}>
            ...
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            className="w-9 h-9 rounded-lg text-sm font-medium transition-all"
            style={{
              backgroundColor: p === page ? '#00D4FF' : '#162440',
              color: p === page ? '#0A1628' : '#94A3B8',
            }}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => page < totalPages && onChange(page + 1)}
        disabled={page >= totalPages}
        className="p-2 rounded-lg transition-colors disabled:opacity-30"
        style={{ backgroundColor: '#162440', color: '#94A3B8' }}
        aria-label="Next"
      >
        <NextIcon size={16} />
      </button>
    </div>
  )
}
