'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Zap, Phone, MapPin, Mail, MessageCircle } from 'lucide-react'
import { getSettings, getCategories } from '@/lib/api'
import { useLanguage } from '@/context/LanguageContext'
import { getName, buildWhatsAppLink } from '@/lib/utils'

export default function Footer() {
  const { lang } = useLanguage()
  const [settings, setSettings] = useState(null)
  const [categories, setCategories] = useState([])

  useEffect(() => {
    getSettings().then((d) => setSettings(d)).catch(() => {})
    getCategories()
      .then((d) => {
        const list = Array.isArray(d) ? d : d?.categories || []
        setCategories(list.filter((c) => !c.parent_id).slice(0, 8))
      })
      .catch(() => {})
  }, [])

  const siteName = lang === 'ar' ? 'Syria Cable Zone' : 'Syria Cable Zone'

  return (
    <footer style={{ backgroundColor: '#0F1E35', borderTop: '1px solid #162440' }} className="mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#00D4FF', color: '#0A1628' }}
              >
                <Zap size={18} />
              </div>
              <span className="font-bold text-lg" style={{ color: '#00D4FF' }}>
                {siteName}
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: '#94A3B8' }}>
              {lang === 'ar'
                ? 'متجر متخصص في قطع الإلكترونيات والكابلات بأفضل الأسعار في سوريا.'
                : 'Specialized store for electronic parts and cables at the best prices in Syria.'}
            </p>
            {settings?.whatsapp && (
              <a
                href={buildWhatsAppLink(settings.whatsapp, lang === 'ar' ? 'مرحباً، أريد الاستفسار' : 'Hello, I have an inquiry')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-80"
                style={{ backgroundColor: '#22C55E', color: '#fff' }}
              >
                <MessageCircle size={16} />
                {lang === 'ar' ? 'واتساب' : 'WhatsApp'}
              </a>
            )}
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-bold text-base mb-4" style={{ color: '#F8F9FA' }}>
              {lang === 'ar' ? 'التصنيفات' : 'Categories'}
            </h3>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat._id || cat.id}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="text-sm transition-colors hover:text-cyan-DEFAULT"
                    style={{ color: '#94A3B8' }}
                  >
                    {getName(cat, lang)}
                  </Link>
                </li>
              ))}
              {categories.length === 0 && (
                <li>
                  <Link href="/categories" className="text-sm" style={{ color: '#94A3B8' }}>
                    {lang === 'ar' ? 'جميع التصنيفات' : 'All Categories'}
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-base mb-4" style={{ color: '#F8F9FA' }}>
              {lang === 'ar' ? 'روابط سريعة' : 'Quick Links'}
            </h3>
            <ul className="space-y-2">
              {[
                { href: '/', label: lang === 'ar' ? 'الرئيسية' : 'Home' },
                { href: '/categories', label: lang === 'ar' ? 'جميع التصنيفات' : 'All Categories' },
                { href: '/new-arrivals', label: lang === 'ar' ? 'أحدث المنتجات' : 'New Arrivals' },
                { href: '/featured', label: lang === 'ar' ? 'المنتجات المميزة' : 'Featured Products' },
                { href: '/contact', label: lang === 'ar' ? 'تواصل معنا' : 'Contact Us' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:text-cyan-DEFAULT"
                    style={{ color: '#94A3B8' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-base mb-4" style={{ color: '#F8F9FA' }}>
              {lang === 'ar' ? 'معلومات التواصل' : 'Contact Info'}
            </h3>
            <ul className="space-y-3">
              {settings?.phone && (
                <li className="flex items-start gap-2">
                  <Phone size={16} style={{ color: '#00D4FF', marginTop: 2, flexShrink: 0 }} />
                  <a
                    href={`tel:${settings.phone}`}
                    className="text-sm transition-colors hover:text-cyan-DEFAULT"
                    style={{ color: '#94A3B8' }}
                  >
                    {settings.phone}
                  </a>
                </li>
              )}
              {settings?.email && (
                <li className="flex items-start gap-2">
                  <Mail size={16} style={{ color: '#00D4FF', marginTop: 2, flexShrink: 0 }} />
                  <a
                    href={`mailto:${settings.email}`}
                    className="text-sm transition-colors hover:text-cyan-DEFAULT"
                    style={{ color: '#94A3B8' }}
                  >
                    {settings.email}
                  </a>
                </li>
              )}
              {settings?.address && (
                <li className="flex items-start gap-2">
                  <MapPin size={16} style={{ color: '#00D4FF', marginTop: 2, flexShrink: 0 }} />
                  <span className="text-sm" style={{ color: '#94A3B8' }}>
                    {lang === 'ar' ? settings.address_ar || settings.address : settings.address_en || settings.address}
                  </span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm"
          style={{ borderTop: '1px solid #162440', color: '#94A3B8' }}
        >
          <span>
            {lang === 'ar'
              ? `© ${new Date().getFullYear()} Syria Cable Zone. جميع الحقوق محفوظة.`
              : `© ${new Date().getFullYear()} Syria Cable Zone. All rights reserved.`}
          </span>
        </div>
      </div>
    </footer>
  )
}
