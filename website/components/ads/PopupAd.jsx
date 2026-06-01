'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'
import { getAds } from '@/lib/api'
import { trackAdClick } from '@/lib/analytics'

export default function PopupAd() {
  const [ad, setAd] = useState(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const seen = sessionStorage.getItem('scz-popup-seen')
    if (seen) return
    getAds('popup')
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.ads || []
        if (list.length > 0) {
          setAd(list[0])
          setTimeout(() => setVisible(true), 1500)
        }
      })
      .catch(() => {})
  }, [])

  function close() {
    setVisible(false)
    sessionStorage.setItem('scz-popup-seen', '1')
  }

  if (!visible || !ad) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(10,22,40,0.85)' }}
      onClick={close}
    >
      <div
        className="relative max-w-lg w-full rounded-2xl overflow-hidden shadow-2xl"
        style={{ backgroundColor: '#0F1E35', border: '1px solid #162440' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={close}
          className="absolute top-3 right-3 z-10 p-1.5 rounded-full transition-colors"
          style={{ backgroundColor: '#162440', color: '#94A3B8' }}
          aria-label="Close"
        >
          <X size={18} />
        </button>
        <a
          href={ad.link_url || '#'}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => { trackAdClick(ad._id || ad.id); close() }}
        >
          {ad.image_url ? (
            <div className="relative w-full" style={{ paddingTop: '60%' }}>
              <Image src={ad.image_url} alt={ad.title || 'Promo'} fill className="object-cover" />
            </div>
          ) : (
            <div
              className="p-8 text-center"
              style={{ background: 'linear-gradient(135deg, #162440, #0F1E35)' }}
            >
              <p className="text-xl font-bold" style={{ color: '#00D4FF' }}>{ad.title}</p>
              {ad.description && (
                <p className="mt-2 text-sm" style={{ color: '#94A3B8' }}>{ad.description}</p>
              )}
            </div>
          )}
        </a>
      </div>
    </div>
  )
}
