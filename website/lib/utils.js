// Format Syrian Pounds with Arabic-Indic numerals
export function formatSYP(amount) {
  if (amount == null || isNaN(amount)) return '—'
  const num = Number(amount)
  const formatted = num.toLocaleString('ar-SA')
  return `${formatted} ل.س`
}

// Format US Dollars
export function formatUSD(amount) {
  if (amount == null || isNaN(amount)) return '—'
  const num = Number(amount)
  return `$${num.toFixed(2)}`
}

// Truncate string
export function truncate(str, len = 60) {
  if (!str) return ''
  if (str.length <= len) return str
  return str.slice(0, len) + '...'
}

// Build WhatsApp link
export function buildWhatsAppLink(number, message = '') {
  if (!number) return '#'
  const clean = number.replace(/\D/g, '')
  const encoded = encodeURIComponent(message)
  return `https://wa.me/${clean}?text=${encoded}`
}

// Get name in active language
export function getName(obj, lang = 'ar') {
  if (!obj) return ''
  if (lang === 'ar') return obj.name_ar || obj.name_en || obj.name || ''
  return obj.name_en || obj.name_ar || obj.name || ''
}

// Get description in active language
export function getDescription(obj, lang = 'ar') {
  if (!obj) return ''
  if (lang === 'ar') return obj.description_ar || obj.description_en || obj.description || ''
  return obj.description_en || obj.description_ar || obj.description || ''
}

// Convert price based on currency
export function formatPrice(priceSYP, priceUSD, currency, exchangeRate) {
  if (currency === 'USD') {
    if (priceUSD != null) return formatUSD(priceUSD)
    if (priceSYP != null && exchangeRate) return formatUSD(priceSYP / exchangeRate)
    return '—'
  }
  if (priceSYP != null) return formatSYP(priceSYP)
  if (priceUSD != null && exchangeRate) return formatSYP(priceUSD * exchangeRate)
  return '—'
}
