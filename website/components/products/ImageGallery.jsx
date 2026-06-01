'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, X, ZoomIn, Cpu } from 'lucide-react'

export default function ImageGallery({ images = [] }) {
  const sorted = [...images].sort((a, b) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0))
  const [current, setCurrent] = useState(0)
  const [lightbox, setLightbox] = useState(false)
  const [touchStart, setTouchStart] = useState(null)

  const total = sorted.length

  function prev() {
    setCurrent((c) => (c === 0 ? total - 1 : c - 1))
  }
  function next() {
    setCurrent((c) => (c === total - 1 ? 0 : c + 1))
  }

  function handleTouchStart(e) {
    setTouchStart(e.touches[0].clientX)
  }
  function handleTouchEnd(e) {
    if (touchStart === null) return
    const diff = touchStart - e.changedTouches[0].clientX
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev()
    setTouchStart(null)
  }

  useEffect(() => {
    function handleKey(e) {
      if (!lightbox) return
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'Escape') setLightbox(false)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [lightbox, total])

  if (total === 0) {
    return (
      <div
        className="rounded-xl flex items-center justify-center"
        style={{ paddingTop: '80%', position: 'relative', backgroundColor: '#162440' }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <Cpu size={64} style={{ color: '#1e2d4a' }} />
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Main image */}
      <div
        className="relative rounded-xl overflow-hidden cursor-zoom-in"
        style={{ paddingTop: '80%', backgroundColor: '#162440' }}
        onClick={() => setLightbox(true)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <Image
          src={sorted[current].url}
          alt={`Image ${current + 1}`}
          fill
          className="object-contain transition-opacity duration-300"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority={current === 0}
        />
        <div className="absolute top-3 end-3 p-1.5 rounded-lg" style={{ backgroundColor: 'rgba(15,30,53,0.7)' }}>
          <ZoomIn size={16} style={{ color: '#94A3B8' }} />
        </div>
        {total > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); prev() }}
              className="absolute start-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full"
              style={{ backgroundColor: 'rgba(15,30,53,0.8)', color: '#fff' }}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); next() }}
              className="absolute end-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full"
              style={{ backgroundColor: 'rgba(15,30,53,0.8)', color: '#fff' }}
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {total > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto hide-scrollbar">
          {sorted.map((img, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="relative shrink-0 rounded-lg overflow-hidden transition-all"
              style={{
                width: 64,
                height: 64,
                border: i === current ? '2px solid #00D4FF' : '2px solid transparent',
                backgroundColor: '#162440',
              }}
            >
              <Image src={img.url} alt={`Thumb ${i + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center"
          style={{ backgroundColor: 'rgba(10,22,40,0.95)' }}
          onClick={() => setLightbox(false)}
        >
          <button
            className="absolute top-4 end-4 p-2 rounded-full z-10"
            style={{ backgroundColor: '#162440', color: '#F8F9FA' }}
            onClick={() => setLightbox(false)}
          >
            <X size={20} />
          </button>
          {total > 1 && (
            <>
              <button
                className="absolute start-4 top-1/2 -translate-y-1/2 p-2 rounded-full z-10"
                style={{ backgroundColor: '#162440', color: '#F8F9FA' }}
                onClick={(e) => { e.stopPropagation(); prev() }}
              >
                <ChevronLeft size={24} />
              </button>
              <button
                className="absolute end-4 top-1/2 -translate-y-1/2 p-2 rounded-full z-10"
                style={{ backgroundColor: '#162440', color: '#F8F9FA' }}
                onClick={(e) => { e.stopPropagation(); next() }}
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}
          <div
            className="relative max-w-3xl max-h-[80vh] w-full mx-8"
            style={{ aspectRatio: '1' }}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={sorted[current].url}
              alt={`Image ${current + 1}`}
              fill
              className="object-contain"
              sizes="80vw"
            />
          </div>
          <div className="absolute bottom-4 text-sm" style={{ color: '#94A3B8' }}>
            {current + 1} / {total}
          </div>
        </div>
      )}
    </>
  )
}
