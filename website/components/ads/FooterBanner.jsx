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
    <div className="w-full overflow-hidden rounded-xl my-8" style={{ border: '1px solid #162440' }}>
      <a
        href={ad.link_url || '#'}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackAdClick(ad._id || ad.id)}
        className="block relative w-full"
        style={{ paddingTop: '15%', minHeight: 100 }}
      >
        {ad.image_url ? (
          <Image src={ad.image_url} alt={ad.title || 'Banner'} fill className="object-cover" />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #0F1E35, #162440)', color: '#00D4FF' }}
          >
            <span className="text-xl font-bold">{ad.title}</span>
          </div>
        )}
      </a>
    </div>
  )
}
