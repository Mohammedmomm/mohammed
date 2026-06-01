'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, Loader2 } from 'lucide-react'
import { getProducts } from '@/lib/api'
import { useLanguage } from '@/context/LanguageContext'
import { getName, truncate } from '@/lib/utils'

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

export default function SearchBar({ autoFocus = false, onClose }) {
  const { lang } = useLanguage()
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const inputRef = useRef(null)
  const containerRef = useRef(null)
  const debouncedQuery = useDebounce(query, 300)

  useEffect(() => {
    if (autoFocus && inputRef.current) inputRef.current.focus()
  }, [autoFocus])

  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setSuggestions([])
      setOpen(false)
      return
    }
    setLoading(true)
    getProducts({ q: debouncedQuery, limit: 6 })
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.products || []
        setSuggestions(list)
        setOpen(true)
      })
      .catch(() => setSuggestions([]))
      .finally(() => setLoading(false))
  }, [debouncedQuery])

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleSubmit(e) {
    e.preventDefault()
    if (!query.trim()) return
    setOpen(false)
    router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    if (onClose) onClose()
  }

  function handleSelect(product) {
    setOpen(false)
    setQuery('')
    router.push(`/product/${product._id || product.id}`)
    if (onClose) onClose()
  }

  const placeholder = lang === 'ar' ? 'ابحث عن منتج...' : 'Search products...'

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSubmit}>
        <div
          className="flex items-center gap-2 rounded-xl px-3 py-2"
          style={{ backgroundColor: '#162440', border: '1px solid #1e2d4a' }}
        >
          {loading ? (
            <Loader2 size={16} style={{ color: '#94A3B8' }} className="animate-spin shrink-0" />
          ) : (
            <Search size={16} style={{ color: '#94A3B8' }} className="shrink-0" />
          )}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="flex-1 bg-transparent outline-none text-sm min-w-0"
            style={{ color: '#F8F9FA' }}
            onFocus={() => suggestions.length > 0 && setOpen(true)}
          />
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(''); setSuggestions([]); setOpen(false) }}
              className="shrink-0"
              style={{ color: '#94A3B8' }}
            >
              <X size={14} />
            </button>
          )}
        </div>
      </form>

      {/* Suggestions dropdown */}
      {open && suggestions.length > 0 && (
        <div
          className="absolute top-full mt-1 left-0 right-0 z-50 rounded-xl overflow-hidden shadow-2xl"
          style={{ backgroundColor: '#0F1E35', border: '1px solid #162440' }}
        >
          {suggestions.map((product) => (
            <button
              key={product._id || product.id}
              onClick={() => handleSelect(product)}
              className="w-full text-start px-4 py-2.5 text-sm transition-colors hover:bg-[#162440] flex items-center gap-3"
              style={{ color: '#F8F9FA' }}
            >
              <Search size={13} style={{ color: '#94A3B8', flexShrink: 0 }} />
              <span>{truncate(getName(product, lang), 50)}</span>
            </button>
          ))}
          <button
            onClick={handleSubmit}
            className="w-full text-start px-4 py-2.5 text-sm font-medium border-t"
            style={{ color: '#00D4FF', borderColor: '#162440' }}
          >
            {lang === 'ar' ? `عرض كل نتائج "${query}"` : `See all results for "${query}"`}
          </button>
        </div>
      )}
    </div>
  )
}
