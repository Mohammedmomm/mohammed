import { formatSYP, formatUSD } from '@/lib/utils'
import { useLanguage } from '@/context/LanguageContext'

export default function VariantSelector({
  variants = [],
  selectedVariant,
  onSelect,
  currency = 'SYP',
  exchangeRate,
}) {
  const { lang } = useLanguage()

  if (!variants.length) return null

  function getPrice(variant) {
    if (currency === 'USD') {
      if (variant.price_usd != null) return formatUSD(variant.price_usd)
      if (variant.price_syp != null && exchangeRate) return formatUSD(variant.price_syp / exchangeRate)
    }
    if (variant.price_syp != null) return formatSYP(variant.price_syp)
    return ''
  }

  return (
    <div>
      <h4 className="text-sm font-semibold mb-2" style={{ color: '#94A3B8' }}>
        {lang === 'ar' ? 'الخيارات المتاحة' : 'Available Options'}
      </h4>
      <div className="flex flex-wrap gap-2">
        {variants.map((variant) => {
          const vid = variant._id || variant.id
          const sel = selectedVariant?._id === vid || selectedVariant?.id === vid
          const available = variant.is_available !== false && variant.stock !== 0
          return (
            <button
              key={vid}
              onClick={() => available && onSelect(variant)}
              disabled={!available}
              className="px-3 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                backgroundColor: sel ? '#00D4FF20' : '#162440',
                border: sel ? '2px solid #00D4FF' : '2px solid #1e2d4a',
                color: sel ? '#00D4FF' : '#F8F9FA',
              }}
            >
              <span>{lang === 'ar' ? variant.name_ar || variant.name : variant.name_en || variant.name}</span>
              {getPrice(variant) && (
                <span className="ms-2 text-xs" style={{ color: sel ? '#00D4FF' : '#FFD700' }}>
                  {getPrice(variant)}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
