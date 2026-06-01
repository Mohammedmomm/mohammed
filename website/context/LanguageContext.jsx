'use client'

import { createContext, useContext, useEffect, useState } from 'react'

const LanguageContext = createContext({
  lang: 'ar',
  dir: 'rtl',
  toggle: () => {},
})

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('ar')

  useEffect(() => {
    const stored = localStorage.getItem('scz-lang')
    if (stored === 'en' || stored === 'ar') {
      setLang(stored)
    }
  }, [])

  useEffect(() => {
    const dir = lang === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.setAttribute('lang', lang)
    document.documentElement.setAttribute('dir', dir)
    localStorage.setItem('scz-lang', lang)
  }, [lang])

  function toggle() {
    setLang((prev) => (prev === 'ar' ? 'en' : 'ar'))
  }

  const dir = lang === 'ar' ? 'rtl' : 'ltr'

  return (
    <LanguageContext.Provider value={{ lang, dir, toggle }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}

export default LanguageContext
