'use client'

import { useEffect, useState } from 'react'
import { MessageCircle } from 'lucide-react'
import { getSettings } from '@/lib/api'
import { buildWhatsAppLink } from '@/lib/utils'
import { useLanguage } from '@/context/LanguageContext'

export default function WhatsAppFloatingButton() {
  const { lang } = useLanguage()
  const [number, setNumber] = useState(null)

  useEffect(() => {
    getSettings()
      .then((d) => {
        if (d?.whatsapp) setNumber(d.whatsapp)
        else if (d?.phone) setNumber(d.phone)
      })
      .catch(() => {})
  }, [])

  if (!number) return null

  const href = buildWhatsAppLink(
    number,
    lang === 'ar' ? 'مرحباً، أريد الاستفسار عن منتج' : 'Hello, I have a product inquiry'
  )

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp"
      className="fixed bottom-6 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-transform hover:scale-110"
      style={{
        backgroundColor: '#22C55E',
        color: '#fff',
        left: lang === 'ar' ? undefined : '1.5rem',
        right: lang === 'ar' ? '1.5rem' : undefined,
        boxShadow: '0 0 0 0 rgba(34,197,94,0.4)',
        animation: 'whatsapp-pulse 2s infinite',
      }}
    >
      <MessageCircle size={26} />
      <style>{`
        @keyframes whatsapp-pulse {
          0% { box-shadow: 0 0 0 0 rgba(34,197,94,0.5); }
          70% { box-shadow: 0 0 0 14px rgba(34,197,94,0); }
          100% { box-shadow: 0 0 0 0 rgba(34,197,94,0); }
        }
      `}</style>
    </a>
  )
}
