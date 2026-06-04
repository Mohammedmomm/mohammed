'use client'

import { useCurrency } from '@/context/CurrencyContext'

export default function CurrencyToggle() {
  const { currency, toggle } = useCurrency()

  return (
    <button onClick={toggle}
      className="flex items-center rounded overflow-hidden text-xs font-bold border border-gray-500 transition-all"
      aria-label="Toggle currency">
      <span className="px-2.5 py-1.5 transition-colors"
        style={{ backgroundColor: currency === 'SYP' ? '#FF9900' : 'transparent', color: currency === 'SYP' ? '#fff' : '#ccc' }}>
        ل.س
      </span>
      <span className="px-2.5 py-1.5 transition-colors"
        style={{ backgroundColor: currency === 'USD' ? '#FF9900' : 'transparent', color: currency === 'USD' ? '#fff' : '#ccc' }}>
        USD
      </span>
    </button>
  )
}
