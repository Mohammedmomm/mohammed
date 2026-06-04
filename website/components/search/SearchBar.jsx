'use client'

import { useState, useEffect, useRef } from 'react'
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
    if (debouncedQuery.length < 2) { setSuggestions([]); setOpen(false); return }
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
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false)
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

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="flex">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={lang === 'ar' ? 'ابحث عن منتج...' : 'Search products...'}
          className="flex-1 px-4 py-2 text-sm outline-none"
          style={{ backgroundColor: '#fff', color: '#0F1111', border: '1px solid #ccc', borderRadius: lang === 'ar' ? '0 6px 6px 0' : '6px 0 0 6px' }}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
        />
        {query && (
          <button type="button" onClick={() => { setQuery(''); setSuggestions([]); setOpen(false) }}
            className="px-2 bg-white border-y border-gray-300" style={{ color: '#565959' }}>
            <X size={14} />
          </button>
        )}
        <button type="submit"
          className="px-4 py-2 flex items-center justify-center transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#FF9900', borderRadius: lang === 'ar' ? '6px 0 0 6px' : '0 6px 6px 0' }}>
          {loading ? <Loader2 size={16} color="#fff" className="animate-spin" /> : <Search size={16} color="#fff" />}
        </button>
      </form>

      {open && suggestions.length > 0 && (
        <div className="absolute top-full mt-1 left-0 right-0 z-50 rounded-md shadow-xl border border-gray-200 bg-white overflow-hidden">
          {suggestions.map((product) => (
            <button key={product._id || product.id} onClick={() => handleSelect(product)}
              className="w-full text-start px-4 py-2.5 text-sm hover:bg-gray-50 flex items-center gap-3 transition-colors"
              style={{ color: '#0F1111' }}>
              <Search size={13} style={{ color: '#565959', flexShrink: 0 }} />
              <span>{truncate(getName(product, lang), 50)}</span>
            </button>
          ))}
          <button onClick={handleSubmit}
            className="w-full text-start px-4 py-2.5 text-sm font-medium border-t border-gray-100"
            style={{ color: '#007185' }}>
            {lang === 'ar' ? `عرض كل نتائج "${query}"` : `See all results for "${query}"`}
          </button>
        </div>
      )}
    </div>
  )
}
