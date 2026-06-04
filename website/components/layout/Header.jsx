'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Menu, X, ChevronDown, Zap } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { useCurrency } from '@/context/CurrencyContext'
import { getCategories } from '@/lib/api'
import { getName } from '@/lib/utils'
import SearchBar from '@/components/search/SearchBar'
import CurrencyToggle from '@/components/ui/CurrencyToggle'

export default function Header() {
  const { lang, toggle: toggleLang } = useLanguage()
  const [categories, setCategories] = useState([])
  const [mobileOpen, setMobileOpen] = useState(false)
  const [catDropdown, setCatDropdown] = useState(false)
  const [scrolled, setScrolled] = useState(false)
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
    function handleScroll() {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
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

  const navLinks = [
    { href: '/', label: lang === 'ar' ? 'الرئيسية' : 'Home' },
    { href: '/new-arrivals', label: lang === 'ar' ? 'الجديد' : 'New Arrivals' },
    { href: '/featured', label: lang === 'ar' ? 'المميز' : 'Featured' },
    { href: '/contact', label: lang === 'ar' ? 'تواصل معنا' : 'Contact Us' },
  ]

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'shadow-lg shadow-black/40' : ''
      }`}
      style={{ backgroundColor: '#0F1E35', borderBottom: '1px solid #162440' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm"
              style={{ backgroundColor: '#00D4FF', color: '#0A1628' }}
            >
              <Zap size={18} />
            </div>
            <div className="leading-tight">
              <div className="font-bold text-base" style={{ color: '#00D4FF' }}>
                Syria Cable Zone
              </div>
              <div className="text-xs" style={{ color: '#94A3B8' }}>
                {lang === 'ar' ? 'قطع إلكترونية' : 'Electronic Parts'}
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 rounded-md text-sm font-medium transition-colors hover:text-cyan"
                style={{ color: '#94A3B8' }}
              >
                {link.label}
              </Link>
            ))}

            {/* Categories dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setCatDropdown((v) => !v)}
                className="flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:text-cyan"
                style={{ color: '#94A3B8' }}
              >
                {lang === 'ar' ? 'التصنيفات' : 'Categories'}
                <ChevronDown
                  size={14}
                  className={`transition-transform ${catDropdown ? 'rotate-180' : ''}`}
                />
              </button>
              {catDropdown && categories.length > 0 && (
                <div
                  className="absolute top-full mt-1 w-56 rounded-lg shadow-xl z-50 py-2"
                  style={{
                    backgroundColor: '#0F1E35',
                    border: '1px solid #162440',
                    [lang === 'ar' ? 'right' : 'left']: 0,
                  }}
                >
                  {categories.map((cat) => (
                    <Link
                      key={cat._id || cat.id}
                      href={`/category/${cat.slug}`}
                      onClick={() => setCatDropdown(false)}
                      className="block px-4 py-2 text-sm transition-colors hover:bg-dark-surface"
                      style={{ color: '#F8F9FA' }}
                    >
                      {getName(cat, lang)}
                    </Link>
                  ))}
                  <div style={{ borderTop: '1px solid #162440' }} className="mt-1 pt-1">
                    <Link
                      href="/categories"
                      onClick={() => setCatDropdown(false)}
                      className="block px-4 py-2 text-sm font-medium"
                      style={{ color: '#00D4FF' }}
                    >
                      {lang === 'ar' ? 'جميع التصنيفات' : 'All Categories'}
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Search */}
          <div className="flex-1 max-w-md hidden md:block">
            <SearchBar lang={lang} />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <CurrencyToggle />
            <button
              onClick={toggleLang}
              className="px-3 py-1.5 rounded-md text-sm font-bold transition-colors border"
              style={{
                borderColor: '#162440',
                color: '#94A3B8',
                backgroundColor: 'transparent',
              }}
            >
              {lang === 'ar' ? 'EN' : 'ع'}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden p-2 rounded-md"
              style={{ color: '#94A3B8' }}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        <div className="md:hidden pb-3">
          <SearchBar lang={lang} />
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="lg:hidden border-t px-4 py-3 space-y-1"
          style={{ backgroundColor: '#0A1628', borderColor: '#162440' }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 rounded-md text-sm"
              style={{ color: '#F8F9FA' }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/categories"
            onClick={() => setMobileOpen(false)}
            className="block px-3 py-2 rounded-md text-sm"
            style={{ color: '#F8F9FA' }}
          >
            {lang === 'ar' ? 'التصنيفات' : 'Categories'}
          </Link>
          {categories.slice(0, 6).map((cat) => (
            <Link
              key={cat._id || cat.id}
              href={`/category/${cat.slug}`}
              onClick={() => setMobileOpen(false)}
              className="block px-6 py-1.5 text-sm"
              style={{ color: '#94A3B8' }}
            >
              {getName(cat, lang)}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
