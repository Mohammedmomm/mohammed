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

  return (
    <footer className="mt-8 border-t border-gray-300" style={{ backgroundColor: '#232F3E' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded flex items-center justify-center" style={{ backgroundColor: '#FF9900' }}>
                <Zap size={16} color="#131921" />
              </div>
              <span className="font-bold text-white">Syria Cable Zone</span>
            </div>
            <p className="text-sm leading-relaxed mb-4 text-gray-400">
              {lang === 'ar'
                ? 'متجر متخصص في قطع الإلكترونيات والكابلات بأفضل الأسعار في سوريا.'
                : 'Specialized store for electronic parts and cables at the best prices in Syria.'}
            </p>
            {settings?.whatsapp && (
              <a
                href={buildWhatsAppLink(settings.whatsapp, lang === 'ar' ? 'مرحباً' : 'Hello')}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded text-sm font-medium text-white"
                style={{ backgroundColor: '#22C55E' }}
              >
                <MessageCircle size={15} />
                {lang === 'ar' ? 'واتساب' : 'WhatsApp'}
              </a>
            )}
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-bold text-base mb-3 text-white">{lang === 'ar' ? 'التصنيفات' : 'Categories'}</h3>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat._id || cat.id}>
                  <Link href={`/category/${cat.slug}`} className="text-sm text-gray-400 hover:text-orange-400 transition-colors">
                    {getName(cat, lang)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-base mb-3 text-white">{lang === 'ar' ? 'روابط سريعة' : 'Quick Links'}</h3>
            <ul className="space-y-2">
              {[
                { href: '/', label: lang === 'ar' ? 'الرئيسية' : 'Home' },
                { href: '/categories', label: lang === 'ar' ? 'جميع التصنيفات' : 'All Categories' },
                { href: '/new-arrivals', label: lang === 'ar' ? 'أحدث المنتجات' : 'New Arrivals' },
                { href: '/featured', label: lang === 'ar' ? 'المنتجات المميزة' : 'Featured' },
                { href: '/contact', label: lang === 'ar' ? 'تواصل معنا' : 'Contact' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-orange-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-base mb-3 text-white">{lang === 'ar' ? 'تواصل معنا' : 'Contact'}</h3>
            <ul className="space-y-3">
              {settings?.phone && (
                <li className="flex items-start gap-2">
                  <Phone size={15} className="text-orange-400 mt-0.5 shrink-0" />
                  <a href={`tel:${settings.phone}`} className="text-sm text-gray-400 hover:text-orange-400 transition-colors">{settings.phone}</a>
                </li>
              )}
              {settings?.email && (
                <li className="flex items-start gap-2">
                  <Mail size={15} className="text-orange-400 mt-0.5 shrink-0" />
                  <a href={`mailto:${settings.email}`} className="text-sm text-gray-400 hover:text-orange-400 transition-colors">{settings.email}</a>
                </li>
              )}
              {settings?.address && (
                <li className="flex items-start gap-2">
                  <MapPin size={15} className="text-orange-400 mt-0.5 shrink-0" />
                  <span className="text-sm text-gray-400">{lang === 'ar' ? settings.address_ar || settings.address : settings.address_en || settings.address}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-600 text-sm text-gray-400 text-center">
          © {new Date().getFullYear()} Syria Cable Zone. {lang === 'ar' ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
        </div>
      </div>
    </footer>
  )
}
