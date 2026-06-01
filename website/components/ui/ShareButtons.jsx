'use client'

import { useState } from 'react'
import { Copy, Check, MessageCircle } from 'lucide-react'
import { buildWhatsAppLink } from '@/lib/utils'
import { useLanguage } from '@/context/LanguageContext'

export default function ShareButtons({ productName = '', url = '' }) {
  const { lang } = useLanguage()
  const [copied, setCopied] = useState(false)

  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '')
  const message = lang === 'ar'
    ? `تفقد هذا المنتج: ${productName}\n${shareUrl}`
    : `Check out this product: ${productName}\n${shareUrl}`

  function handleCopy() {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="flex items-center gap-2">
      <a
        href={buildWhatsAppLink('', message)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-80"
        style={{ backgroundColor: '#22C55E', color: '#fff' }}
      >
        <MessageCircle size={15} />
        {lang === 'ar' ? 'مشاركة' : 'Share'}
      </a>
      <button
        onClick={handleCopy}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
        style={{ backgroundColor: '#162440', color: copied ? '#22C55E' : '#94A3B8' }}
      >
        {copied ? <Check size={15} /> : <Copy size={15} />}
        {copied
          ? (lang === 'ar' ? 'تم النسخ' : 'Copied!')
          : (lang === 'ar' ? 'نسخ الرابط' : 'Copy Link')}
      </button>
    </div>
  )
}
