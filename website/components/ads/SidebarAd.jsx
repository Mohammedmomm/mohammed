'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { getAds } from '@/lib/api'
import { trackAdClick } from '@/lib/analytics'

export default function SidebarAd() {
  const [ad, setAd] = useState(null)

  useEffect(() => {
    getAds('sidebar')
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.ads || []
        if (list.length > 0) setAd(list[0])
      })
      .catch(() => {})
  }, [])

  if (!ad) return null

  return (
    <a
      href={ad.link_url || '#'}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackAdClick(ad._id || ad.id)}
      className="block rounded-xl overflow-hidden"
      style={{ border: '1px solid #162440' }}
    >
      {ad.image_url ? (
        <div className="relative w-full" style={{ paddingTop: '100%' }}>
          <Image src={ad.image_url} alt={ad.title || 'Ad'} fill className="object-cover" />
        </div>
      ) : (
        <div
          className="w-full p-4 text-center"
          style={{ backgroundColor: '#162440', color: '#00D4FF' }}
        >
          {ad.title}
        </div>
      )}
    </a>
  )
}
