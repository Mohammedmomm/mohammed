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

  return (
    <div className="max-w-7xl mx-auto px-4 py-3">
      <a
        href={ad.link_url || '#'}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackAdClick(ad._id || ad.id)}
        className="block relative w-full rounded-xl overflow-hidden"
        style={{ height: 160 }}
      >
        {ad.image_url ? (
          <Image src={ad.image_url} alt={ad.title || 'Banner'} fill className="object-cover" priority />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #0F1E35, #162440)' }}>
            <span className="text-xl font-bold" style={{ color: '#00D4FF' }}>{ad.title || ''}</span>
          </div>
        )}
      </a>
    </div>
  )
}
