'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Cpu } from 'lucide-react'
import PriceDisplay from './PriceDisplay'
import { getName, truncate } from '@/lib/utils'

export default function ProductCard({ product, lang = 'ar', currency = 'SYP', exchangeRate }) {
  if (!product) return null

  const name = getName(product, lang)
  const brandName = product.brand
    ? (lang === 'ar' ? product.brand.name_ar || product.brand.name_en : product.brand.name_en || product.brand.name_ar) || product.brand.name
    : null

  const primaryImage = product.images?.find((i) => i.is_primary) || product.images?.[0]
  const imageUrl = primaryImage?.url || product.image_url || null
  const isAvailable = product.is_available !== false && product.stock !== 0
  const isFeatured = product.is_featured
  const hasDetails = product.has_details !== false

  const inner = (
    <div className="bg-white rounded-md border border-gray-200 hover:shadow-md transition-shadow duration-200 flex flex-col h-full overflow-hidden group">
      {/* Image */}
      <div className="relative bg-white flex items-center justify-center overflow-hidden" style={{ paddingTop: '75%' }}>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-contain p-2 transition-transform duration-200 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <Cpu size={36} style={{ color: '#D5D9D9' }} />
          </div>
        )}
        {/* Badges */}
        <div className="absolute top-2 start-2 flex flex-col gap-1">
          {isFeatured && (
            <span className="px-2 py-0.5 rounded text-xs font-bold" style={{ backgroundColor: '#FF9900', color: '#fff' }}>
              {lang === 'ar' ? 'مميز' : 'Featured'}
            </span>
          )}
          {!isAvailable && (
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-gray-500 text-white">
              {lang === 'ar' ? 'غير متوفر' : 'Out of Stock'}
            </span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-1 flex-1">
        {brandName && (
          <span className="text-xs font-medium" style={{ color: '#007185' }}>{brandName}</span>
        )}
        <h3 className="text-sm leading-snug line-clamp-2" style={{ color: '#0F1111' }}>
          {truncate(name, 70)}
        </h3>
        <div className="mt-auto pt-2">
          <PriceDisplay
            price_syp={product.price_syp}
            price_usd={product.price_usd}
            currency={currency}
            exchangeRate={exchangeRate}
            size="sm"
          />
        </div>
        {isAvailable && (
          <span className="text-xs mt-1" style={{ color: '#007600' }}>
            {lang === 'ar' ? 'متوفر' : 'In Stock'}
          </span>
        )}
      </div>
    </div>
  )

  if (!hasDetails) return inner

  return (
    <Link href={`/product/${product._id || product.id}`} className="block h-full" style={{ textDecoration: 'none' }}>
      {inner}
    </Link>
  )
}
