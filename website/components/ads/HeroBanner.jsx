'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { getAds } from '@/lib/api'
import { trackAdClick } from '@/lib/analytics'

export default function HeroBanner() {
  const [ad, setAd] = useState(null)

  useEffect(() => {
    getAds('hero')
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.ads || []
        if (list.length > 0) setAd(list[0])
      })
      .catch(() => {})
  }, [])

  if (!ad) return null

  function handleClick() {
    trackAdClick(ad._id || ad.id)
  }

  return (
    <div className="w-full overflow-hidden" style={{ maxHeight: 420 }}>
      <a
        href={ad.link_url || '#'}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className="block relative w-full"
        style={{ paddingTop: '25%', minHeight: 180 }}
      >
        {ad.image_url ? (
          <Image
            src={ad.image_url}
            alt={ad.title || 'Banner'}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #0F1E35, #162440)' }}
          >
            <span className="text-2xl font-bold" style={{ color: '#00D4FF' }}>
              {ad.title || ''}
            </span>
          </div>
        )}
      </a>
    </div>
  )
}
