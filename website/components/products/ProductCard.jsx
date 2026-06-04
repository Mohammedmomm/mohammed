'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Cpu, Tag } from 'lucide-react'
import PriceDisplay from './PriceDisplay'
import { getName, truncate } from '@/lib/utils'

export default function ProductCard({ product, lang = 'ar', currency = 'SYP', exchangeRate }) {
  if (!product) return null

  const hasDetails = product.has_details !== false
  const name = getName(product, lang)
  const brandName = lang === 'ar'
    ? (product.brand_name_ar || product.brand_name || null)
    : (product.brand_name || product.brand_name_ar || null)

  const imageUrl = product.primary_image
    || product.images?.find((i) => i.is_primary)?.image_url
    || product.images?.find((i) => i.is_primary)?.url
    || product.images?.[0]?.image_url
    || product.images?.[0]?.url
    || null

  const isAvailable = product.is_available !== false && product.stock !== 0
  const isFeatured = product.is_featured

  const cardContent = (
    <motion.div
      whileHover={hasDetails ? { scale: 1.03 } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="rounded-xl overflow-hidden flex flex-col h-full group transition-all duration-200"
      style={{
        backgroundColor: '#0F1E35',
        border: '1px solid #162440',
        cursor: hasDetails ? 'pointer' : 'default',
      }}
    >
      {/* Image */}
      <div className="relative overflow-hidden" style={{ paddingTop: '75%', backgroundColor: '#162440' }}>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Cpu size={40} style={{ color: '#162440' }} />
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 start-2 flex flex-col gap-1">
          {isFeatured && (
            <span
              className="px-2 py-0.5 rounded text-xs font-bold"
              style={{ backgroundColor: '#FFD700', color: '#0A1628' }}
            >
              {lang === 'ar' ? 'مميز' : 'Featured'}
            </span>
          )}
          {!isAvailable && (
            <span
              className="px-2 py-0.5 rounded text-xs font-bold"
              style={{ backgroundColor: '#EF4444', color: '#fff' }}
            >
              {lang === 'ar' ? 'غير متوفر' : 'Out of Stock'}
            </span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-2 flex-1">
        {brandName && (
          <span className="text-xs font-medium flex items-center gap-1" style={{ color: '#00D4FF' }}>
            <Tag size={11} />
            {brandName}
          </span>
        )}
        <h3 className="text-sm font-semibold leading-snug line-clamp-2" style={{ color: '#F8F9FA' }}>
          {truncate(name, 70)}
        </h3>
        <div className="mt-auto pt-1">
          <PriceDisplay
            price_syp={product.price_syp}
            price_usd={product.price_usd}
            currency={currency}
            exchangeRate={exchangeRate}
            size="sm"
          />
        </div>
      </div>
    </motion.div>
  )

  if (!hasDetails) return cardContent

  return (
    <Link
      href={`/product/${product._id || product.id}`}
      className="block h-full group"
      style={{ textDecoration: 'none' }}
    >
      <div
        className="rounded-xl overflow-hidden flex flex-col h-full transition-all duration-200"
        style={{ position: 'relative' }}
      >
        <motion.div
          whileHover={{ scale: 1.03 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="rounded-xl overflow-hidden flex flex-col h-full"
          style={{
            backgroundColor: '#0F1E35',
            border: '1px solid #162440',
          }}
        >
          {/* Image */}
          <div className="relative overflow-hidden" style={{ paddingTop: '75%', backgroundColor: '#162440' }}>
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Cpu size={40} style={{ color: '#162440' }} />
              </div>
            )}
            <div className="absolute top-2 start-2 flex flex-col gap-1">
              {isFeatured && (
                <span
                  className="px-2 py-0.5 rounded text-xs font-bold"
                  style={{ backgroundColor: '#FFD700', color: '#0A1628' }}
                >
                  {lang === 'ar' ? 'مميز' : 'Featured'}
                </span>
              )}
              {!isAvailable && (
                <span
                  className="px-2 py-0.5 rounded text-xs font-bold"
                  style={{ backgroundColor: '#EF4444', color: '#fff' }}
                >
                  {lang === 'ar' ? 'غير متوفر' : 'Out of Stock'}
                </span>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="p-3 flex flex-col gap-2 flex-1">
            {brandName && (
              <span className="text-xs font-medium flex items-center gap-1" style={{ color: '#00D4FF' }}>
                <Tag size={11} />
                {brandName}
              </span>
            )}
            <h3 className="text-sm font-semibold leading-snug line-clamp-2" style={{ color: '#F8F9FA' }}>
              {truncate(name, 70)}
            </h3>
            <div className="mt-auto pt-1">
              <PriceDisplay
                price_syp={product.price_syp}
                price_usd={product.price_usd}
                currency={currency}
                exchangeRate={exchangeRate}
                size="sm"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </Link>
  )
}
