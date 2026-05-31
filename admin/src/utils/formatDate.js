import { format, parseISO } from 'date-fns'
import { ar as arLocale } from 'date-fns/locale'

export const formatDate = (date, lang = 'ar') => {
  if (!date) return '—'
  try {
    const d = typeof date === 'string' ? parseISO(date) : date
    const locale = lang === 'ar' ? arLocale : undefined
    return format(d, 'dd/MM/yyyy', { locale })
  } catch (e) {
    return String(date)
  }
}

export const formatDateTime = (date, lang = 'ar') => {
  if (!date) return '—'
  try {
    const d = typeof date === 'string' ? parseISO(date) : date
    const locale = lang === 'ar' ? arLocale : undefined
    return format(d, 'dd/MM/yyyy HH:mm', { locale })
  } catch (e) {
    return String(date)
  }
}
