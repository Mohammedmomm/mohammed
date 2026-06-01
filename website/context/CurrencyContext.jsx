'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { getExchangeRate } from '@/lib/api'

const CurrencyContext = createContext({
  currency: 'SYP',
  exchangeRate: null,
  toggle: () => {},
})

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState('SYP')
  const [exchangeRate, setExchangeRate] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem('scz-currency')
    if (stored === 'USD' || stored === 'SYP') {
      setCurrency(stored)
    }
    // Fetch exchange rate
    getExchangeRate()
      .then((data) => {
        if (data && data.rate) setExchangeRate(data.rate)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    localStorage.setItem('scz-currency', currency)
  }, [currency])

  function toggle() {
    setCurrency((prev) => (prev === 'SYP' ? 'USD' : 'SYP'))
  }

  return (
    <CurrencyContext.Provider value={{ currency, exchangeRate, toggle }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  return useContext(CurrencyContext)
}

export default CurrencyContext
