import { useState } from 'react'
import { X, Star, Image as ImageIcon, Link, Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const ImageUpload = ({
  onUpload,
  multiple = true,
  currentImages = [],
  onDelete,
  onSetPrimary,
}) => {
  const { t } = useTranslation()
  const [urlInput, setUrlInput] = useState('')

  const addUrl = () => {
    const url = urlInput.trim()
    if (!url || !url.startsWith('http')) return
    onUpload?.(url)
    setUrlInput('')
  }

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <div className="flex-1 relative">
          <Link size={15} className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addUrl())}
            placeholder="https://example.com/image.jpg"
            className="w-full ps-9 pe-3 py-2.5 border border-gray-200 rounded-xl text-sm"
            dir="ltr"
          />
        </div>
        <button
          type="button"
          onClick={addUrl}
          className="flex items-center gap-1.5 px-4 py-2.5 text-white rounded-xl text-sm font-medium"
          style={{ backgroundColor: '#1E6FBF' }}
        >
          <Plus size={15} />
          إضافة
        </button>
      </div>

      {currentImages.length > 0 ? (
        <div className="grid grid-cols-4 gap-3 mt-2">
          {currentImages.map((img, idx) => (
            <div
              key={idx}
              className={`relative rounded-xl overflow-hidden border-2 group ${
                img.is_primary || idx === 0 ? 'border-blue-500' : 'border-gray-200'
              }`}
            >
              <img
                src={typeof img === 'string' ? img : img.url}
                alt=""
                className="w-full h-24 object-cover"
                onError={(e) => {
                  e.target.style.display = 'none'
                  e.target.nextSibling.style.display = 'flex'
                }}
              />
              <div className="hidden w-full h-24 bg-gray-100 items-center justify-center">
                <ImageIcon size={24} className="text-gray-400" />
              </div>
              {(img.is_primary || idx === 0) && (
                <div className="absolute top-1 start-1 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-md flex items-center gap-1">
                  <Star size={10} fill="white" />
                  {t('products.primary')}
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {!img.is_primary && idx !== 0 && (
                  <button
                    type="button"
                    onClick={() => onSetPrimary?.(idx)}
                    className="bg-white/90 text-blue-600 rounded-lg p-1.5 hover:bg-white"
                    title={t('products.setPrimary')}
                  >
                    <Star size={14} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onDelete?.(idx)}
                  className="bg-white/90 text-red-500 rounded-lg p-1.5 hover:bg-white"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center text-gray-400 text-sm">
          الصق رابط صورة في الحقل أعلاه ثم اضغط إضافة
        </div>
      )}
    </div>
  )
}

export default ImageUpload
