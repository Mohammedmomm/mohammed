import { formatSYP, formatUSD } from '@/lib/utils'

export default function PriceDisplay({
  price_syp,
  price_usd,
  currency = 'SYP',
  exchangeRate,
  size = 'sm',
}) {
  function primary() {
    if (currency === 'USD') {
      if (price_usd != null) return formatUSD(price_usd)
      if (price_syp != null && exchangeRate) return formatUSD(price_syp / exchangeRate)
      return null
    }
    if (price_syp != null) return formatSYP(price_syp)
    if (price_usd != null && exchangeRate) return formatSYP(price_usd * exchangeRate)
    return null
  }

  function secondary() {
    if (currency === 'USD') {
      if (price_syp != null) return formatSYP(price_syp)
      return null
    }
    if (price_usd != null) return formatUSD(price_usd)
    return null
  }

  const p = primary()
  const s = secondary()

  if (!p) return null

  const isLg = size === 'lg'

  return (
    <div className="flex flex-col gap-0.5">
      <span
        className={`font-bold ${isLg ? 'text-2xl' : 'text-base'}`}
        style={{ color: '#FFD700' }}
      >
        {p}
      </span>
      {s && (
        <span className={`${isLg ? 'text-sm' : 'text-xs'}`} style={{ color: '#94A3B8' }}>
          {s}
        </span>
      )}
    </div>
  )
}
