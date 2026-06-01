'use client'

import { motion } from 'framer-motion'
import ProductCard from './ProductCard'
import SkeletonCard from '@/components/ui/SkeletonCard'
import EmptyState from '@/components/ui/EmptyState'
import BetweenProductsAd from '@/components/ads/BetweenProductsAd'
import { useLanguage } from '@/context/LanguageContext'
import { useCurrency } from '@/context/CurrencyContext'

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
}

export default function ProductGrid({
  products = [],
  loading = false,
  lang: langProp,
  currency: currencyProp,
  exchangeRate: exchangeRateProp,
}) {
  const { lang: ctxLang } = useLanguage()
  const { currency: ctxCurrency, exchangeRate: ctxRate } = useCurrency()
  const lang = langProp || ctxLang
  const currency = currencyProp || ctxCurrency
  const exchangeRate = exchangeRateProp ?? ctxRate

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  if (!products.length) {
    return (
      <EmptyState
        title={lang === 'ar' ? 'لا توجد منتجات' : 'No Products Found'}
        subtitle={lang === 'ar' ? 'لم يتم العثور على منتجات مطابقة' : 'No matching products were found'}
        actionLabel={lang === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
        actionHref="/"
      />
    )
  }

  const items = []
  products.forEach((product, index) => {
    items.push(
      <motion.div key={product._id || product.id || index} variants={itemVariants}>
        <ProductCard
          product={product}
          lang={lang}
          currency={currency}
          exchangeRate={exchangeRate}
        />
      </motion.div>
    )
    // Insert ad every 12 items
    if ((index + 1) % 12 === 0 && index < products.length - 1) {
      items.push(<BetweenProductsAd key={`ad-${index}`} />)
    }
  })

  return (
    <motion.div
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {items}
    </motion.div>
  )
}
