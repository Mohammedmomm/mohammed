'use client'

import { useCurrency } from '@/context/CurrencyContext'

export default function CurrencyToggle() {
  const { currency, toggle } = useCurrency()

  return (
    <button
      onClick={toggle}
      className="flex items-center rounded-full text-xs font-bold overflow-hidden transition-all"
      style={{ border: '1px solid #162440', backgroundColor: '#162440' }}
      aria-label="Toggle currency"
    >
      <span
        className="px-3 py-1.5 transition-colors"
        style={{
          backgroundColor: currency === 'SYP' ? '#00D4FF' : 'transparent',
          color: currency === 'SYP' ? '#0A1628' : '#94A3B8',
        }}
      >
        ل.س
      </span>
      <span
        className="px-3 py-1.5 transition-colors"
        style={{
          backgroundColor: currency === 'USD' ? '#00D4FF' : 'transparent',
          color: currency === 'USD' ? '#0A1628' : '#94A3B8',
        }}
      >
        USD
      </span>
    </button>
  )
}
