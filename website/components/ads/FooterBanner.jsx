'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { getAds } from '@/lib/api'
import { trackAdClick } from '@/lib/analytics'

export default function FooterBanner() {
  const [ad, setAd] = useState(null)

  useEffect(() => {
    getAds('footer_banner')
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.ads || []
        if (list.length > 0) setAd(list[0])
      })
      .catch(() => {})
  }, [])

  if (!ad) return null

  return (
    <div className="w-full overflow-hidden rounded-md my-6 border border-gray-200">
      <a href={ad.link_url || '#'} target="_blank" rel="noopener noreferrer"
        onClick={() => trackAdClick(ad._id || ad.id)}
        className="block relative w-full" style={{ paddingTop: '12%', minHeight: 80 }}>
        {ad.image_url ? (
          <Image src={ad.image_url} alt={ad.title || 'Banner'} fill className="object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: '#232F3E' }}>
            <span className="text-lg font-bold text-white">{ad.title}</span>
          </div>
        )}
      </a>
    </div>
  )
}
