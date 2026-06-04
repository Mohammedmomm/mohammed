'use client'

import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

export default function Breadcrumb({ items = [] }) {
  const { dir } = useLanguage()
  const ChevronIcon = dir === 'rtl' ? ChevronLeft : ChevronRight

  return (
    <nav aria-label="breadcrumb" className="flex items-center gap-1 text-sm flex-wrap">
      {items.map((item, index) => {
        const isLast = index === items.length - 1
        return (
          <span key={index} className="flex items-center gap-1">
            {index > 0 && <ChevronIcon size={13} style={{ color: '#D5D9D9', flexShrink: 0 }} />}
            {isLast ? (
              <span style={{ color: '#0F1111' }} className="font-medium">{item.label}</span>
            ) : (
              <Link href={item.href} className="hover:underline transition-colors" style={{ color: '#007185' }}>
                {item.label}
              </Link>
            )}
          </span>
        )
      })}
    </nav>
  )
}
