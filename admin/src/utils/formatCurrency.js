export const formatSYP = (amount) => {
  if (amount === null || amount === undefined) return '—'
  return new Intl.NumberFormat('ar-SY', {
    style: 'decimal',
    maximumFractionDigits: 0,
  }).format(amount) + ' ل.س'
}

export const formatUSD = (amount) => {
  if (amount === null || amount === undefined) return '—'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}
