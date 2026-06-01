'use client'

import { useEffect, useState } from 'react'
import { Phone, MessageCircle, MapPin, Mail, Clock, Megaphone } from 'lucide-react'
import { getSettings } from '@/lib/api'
import { useLanguage } from '@/context/LanguageContext'
import { buildWhatsAppLink } from '@/lib/utils'
import Breadcrumb from '@/components/layout/Breadcrumb'

export default function ContactPage() {
  const { lang } = useLanguage()
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSettings().then(setSettings).catch(() => {}).finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#0A1628' }}>
        <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="shimmer h-24 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  const address = settings
    ? (lang === 'ar' ? settings.address_ar || settings.address : settings.address_en || settings.address)
    : null

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0A1628' }}>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-4">
          <Breadcrumb
            items={[
              { label: lang === 'ar' ? 'الرئيسية' : 'Home', href: '/' },
              { label: lang === 'ar' ? 'تواصل معنا' : 'Contact Us', href: '/contact' },
            ]}
          />
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold mb-8" style={{ color: '#F8F9FA' }}>
          {lang === 'ar' ? 'تواصل معنا' : 'Contact Us'}
        </h1>

        {!settings && (
          <p className="text-center py-10" style={{ color: '#94A3B8' }}>
            {lang === 'ar' ? 'تعذّر تحميل معلومات التواصل' : 'Could not load contact information'}
          </p>
        )}

        {settings && (
          <div className="space-y-4">
            {/* WhatsApp */}
            {settings.whatsapp && (
              <a
                href={buildWhatsAppLink(settings.whatsapp, lang === 'ar' ? 'مرحباً، أريد الاستفسار' : 'Hello, I have an inquiry')}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-5 rounded-xl transition-all hover:scale-[1.02] block"
                style={{ backgroundColor: '#0F1E35', border: '1px solid #162440' }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: '#22C55E20' }}>
                  <MessageCircle size={24} style={{ color: '#22C55E' }} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#94A3B8' }}>
                    WhatsApp
                  </p>
                  <p className="font-bold text-lg" style={{ color: '#F8F9FA' }}>{settings.whatsapp}</p>
                </div>
              </a>
            )}

            {/* Phone */}
            {settings.phone && (
              <a
                href={`tel:${settings.phone}`}
                className="flex items-center gap-4 p-5 rounded-xl transition-all hover:scale-[1.02] block"
                style={{ backgroundColor: '#0F1E35', border: '1px solid #162440' }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: '#00D4FF20' }}>
                  <Phone size={24} style={{ color: '#00D4FF' }} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#94A3B8' }}>
                    {lang === 'ar' ? 'الهاتف' : 'Phone'}
                  </p>
                  <p className="font-bold text-lg" style={{ color: '#F8F9FA' }}>{settings.phone}</p>
                </div>
              </a>
            )}

            {/* Email */}
            {settings.email && (
              <a
                href={`mailto:${settings.email}`}
                className="flex items-center gap-4 p-5 rounded-xl transition-all hover:scale-[1.02] block"
                style={{ backgroundColor: '#0F1E35', border: '1px solid #162440' }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: '#00D4FF15' }}>
                  <Mail size={24} style={{ color: '#00D4FF' }} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#94A3B8' }}>
                    {lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                  </p>
                  <p className="font-bold" style={{ color: '#F8F9FA' }}>{settings.email}</p>
                </div>
              </a>
            )}

            {/* Address */}
            {address && (
              <div
                className="flex items-start gap-4 p-5 rounded-xl"
                style={{ backgroundColor: '#0F1E35', border: '1px solid #162440' }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: '#FFD70015' }}>
                  <MapPin size={24} style={{ color: '#FFD700' }} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#94A3B8' }}>
                    {lang === 'ar' ? 'العنوان' : 'Address'}
                  </p>
                  <p className="leading-relaxed" style={{ color: '#F8F9FA' }}>{address}</p>
                </div>
              </div>
            )}

            {/* Working Hours */}
            {settings.working_hours && (
              <div
                className="flex items-start gap-4 p-5 rounded-xl"
                style={{ backgroundColor: '#0F1E35', border: '1px solid #162440' }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: '#00D4FF15' }}>
                  <Clock size={24} style={{ color: '#00D4FF' }} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#94A3B8' }}>
                    {lang === 'ar' ? 'ساعات العمل' : 'Working Hours'}
                  </p>
                  <p style={{ color: '#F8F9FA' }}>{settings.working_hours}</p>
                </div>
              </div>
            )}

            {/* Ads contact section */}
            {(settings.ads_contact || settings.ads_email || settings.ads_whatsapp) && (
              <div
                className="p-5 rounded-xl"
                style={{ backgroundColor: '#0F1E35', border: '1px solid #FFD70040' }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Megaphone size={20} style={{ color: '#FFD700' }} />
                  <h3 className="font-bold" style={{ color: '#FFD700' }}>
                    {lang === 'ar' ? 'للإعلانات والتعاون' : 'For Advertising & Partnerships'}
                  </h3>
                </div>
                <div className="space-y-2 text-sm" style={{ color: '#94A3B8' }}>
                  {settings.ads_contact && <p>{settings.ads_contact}</p>}
                  {settings.ads_email && (
                    <a href={`mailto:${settings.ads_email}`} style={{ color: '#00D4FF' }}>
                      {settings.ads_email}
                    </a>
                  )}
                  {settings.ads_whatsapp && (
                    <a
                      href={buildWhatsAppLink(settings.ads_whatsapp, 'مرحباً، أريد الإعلان')}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#22C55E' }}
                    >
                      {settings.ads_whatsapp}
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
