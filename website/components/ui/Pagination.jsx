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
    for (let i = Math.max(1, page - delta); i <= Math.min(totalPages, page + delta); i++) pages.push(i)
    if (pages[0] > 1) { pages.unshift('...'); pages.unshift(1) }
    if (pages[pages.length - 1] < totalPages) { pages.push('...'); pages.push(totalPages) }
    return pages
  }

  const btnBase = 'w-9 h-9 rounded border text-sm font-medium transition-all flex items-center justify-center'

  return (
    <div className="flex items-center justify-center gap-1 mt-8 flex-wrap">
      <button onClick={() => page > 1 && onChange(page - 1)} disabled={page <= 1}
        className={`${btnBase} disabled:opacity-30`}
        style={{ borderColor: '#D5D9D9', backgroundColor: '#fff', color: '#0F1111' }}>
        <PrevIcon size={15} />
      </button>

      {buildPages().map((p, i) =>
        p === '...' ? (
          <span key={`dot-${i}`} className="px-2 text-sm" style={{ color: '#565959' }}>...</span>
        ) : (
          <button key={p} onClick={() => onChange(p)}
            className={btnBase}
            style={{
              backgroundColor: p === page ? '#FF9900' : '#fff',
              borderColor: p === page ? '#FF9900' : '#D5D9D9',
              color: p === page ? '#fff' : '#0F1111',
            }}>
            {p}
          </button>
        )
      )}

      <button onClick={() => page < totalPages && onChange(page + 1)} disabled={page >= totalPages}
        className={`${btnBase} disabled:opacity-30`}
        style={{ borderColor: '#D5D9D9', backgroundColor: '#fff', color: '#0F1111' }}>
        <NextIcon size={15} />
      </button>
    </div>
  )
}
