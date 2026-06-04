'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Menu, X, ChevronDown, Search, Zap } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { getCategories } from '@/lib/api'
import { getName } from '@/lib/utils'
import CurrencyToggle from '@/components/ui/CurrencyToggle'
import { useRouter } from 'next/navigation'

export default function Header() {
  const { lang, toggle: toggleLang } = useLanguage()
  const router = useRouter()
  const [categories, setCategories] = useState([])
  const [mobileOpen, setMobileOpen] = useState(false)
  const [catDropdown, setCatDropdown] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const dropdownRef = useRef(null)

  useEffect(() => {
    getCategories()
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.categories || []
        setCategories(list.filter((c) => !c.parent_id).slice(0, 10))
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setCatDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
  }

  const navLinks = [
    { href: '/', label: lang === 'ar' ? 'الرئيسية' : 'Home' },
    { href: '/new-arrivals', label: lang === 'ar' ? 'الجديد' : 'New Arrivals' },
    { href: '/featured', label: lang === 'ar' ? 'المميز' : 'Featured' },
    { href: '/contact', label: lang === 'ar' ? 'تواصل معنا' : 'Contact' },
  ]

  return (
    <header className="sticky top-0 z-50">
      {/* Top bar */}
      <div style={{ backgroundColor: '#131921' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-3 h-14">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 rounded flex items-center justify-center" style={{ backgroundColor: '#FF9900' }}>
                <Zap size={16} color="#131921" />
              </div>
              <div className="leading-tight hidden sm:block">
                <div className="font-bold text-sm text-white">Syria Cable Zone</div>
                <div className="text-xs" style={{ color: '#ccc' }}>
                  {lang === 'ar' ? 'قطع إلكترونية' : 'Electronic Parts'}
                </div>
              </div>
            </Link>

            {/* Search bar */}
            <form onSubmit={handleSearch} className="flex flex-1 max-w-2xl">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === 'ar' ? 'ابحث عن منتج...' : 'Search products...'}
                className="flex-1 px-4 py-2.5 text-sm outline-none rounded-s-md"
                style={{ backgroundColor: '#fff', color: '#0F1111', borderRadius: lang === 'ar' ? '0 6px 6px 0' : '6px 0 0 6px' }}
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-e-md flex items-center justify-center transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#FF9900', borderRadius: lang === 'ar' ? '6px 0 0 6px' : '0 6px 6px 0' }}
              >
                <Search size={18} color="#131921" />
              </button>
            </form>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <CurrencyToggle />
              <button
                onClick={toggleLang}
                className="px-3 py-1.5 rounded text-sm font-bold text-white border border-gray-600 hover:border-white transition-colors"
              >
                {lang === 'ar' ? 'EN' : 'ع'}
              </button>
              <button
                onClick={() => setMobileOpen((v) => !v)}
                className="lg:hidden p-2 text-white"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Nav bar */}
      <div style={{ backgroundColor: '#232F3E' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="hidden lg:flex items-center gap-1 h-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-1 text-sm text-white rounded hover:outline hover:outline-1 hover:outline-white transition-all"
              >
                {link.label}
              </Link>
            ))}

            {/* Categories dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setCatDropdown((v) => !v)}
                className="flex items-center gap-1 px-3 py-1 text-sm text-white rounded hover:outline hover:outline-1 hover:outline-white transition-all"
              >
                {lang === 'ar' ? 'التصنيفات' : 'Categories'}
                <ChevronDown size={13} className={`transition-transform ${catDropdown ? 'rotate-180' : ''}`} />
              </button>
              {catDropdown && categories.length > 0 && (
                <div
                  className="absolute top-full mt-1 w-52 rounded-md shadow-xl z-50 py-1 border"
                  style={{ backgroundColor: '#fff', borderColor: '#D5D9D9', [lang === 'ar' ? 'right' : 'left']: 0 }}
                >
                  {categories.map((cat) => (
                    <Link
                      key={cat._id || cat.id}
                      href={`/category/${cat.slug}`}
                      onClick={() => setCatDropdown(false)}
                      className="block px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
                      style={{ color: '#0F1111' }}
                    >
                      {getName(cat, lang)}
                    </Link>
                  ))}
                  <div className="border-t border-gray-200 mt-1 pt-1">
                    <Link
                      href="/categories"
                      onClick={() => setCatDropdown(false)}
                      className="block px-4 py-2 text-sm font-semibold"
                      style={{ color: '#007185' }}
                    >
                      {lang === 'ar' ? 'جميع التصنيفات' : 'All Categories'}
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t px-4 py-3 space-y-1" style={{ backgroundColor: '#232F3E', borderColor: '#3a4553' }}>
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 text-sm text-white rounded hover:bg-gray-700">
              {link.label}
            </Link>
          ))}
          <Link href="/categories" onClick={() => setMobileOpen(false)}
            className="block px-3 py-2 text-sm text-white rounded hover:bg-gray-700">
            {lang === 'ar' ? 'التصنيفات' : 'Categories'}
          </Link>
        </div>
      )}
    </header>
  )
}
