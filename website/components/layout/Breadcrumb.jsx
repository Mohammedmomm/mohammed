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
            {index > 0 && (
              <ChevronIcon size={14} style={{ color: '#94A3B8', flexShrink: 0 }} />
            )}
            {isLast ? (
              <span style={{ color: '#F8F9FA' }} className="font-medium">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="transition-colors hover:text-cyan-DEFAULT"
                style={{ color: '#94A3B8' }}
              >
                {item.label}
              </Link>
            )}
          </span>
        )
      })}
    </nav>
  )
}
