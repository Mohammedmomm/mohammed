import { useRef, useState } from 'react'
import { Upload, X, Star, Image as ImageIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import axiosInstance from '../../api/axiosInstance'

const ImageUpload = ({
  onUpload,
  multiple = true,
  currentImages = [],
  onDelete,
  onSetPrimary,
}) => {
  const { t } = useTranslation()
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [dragging, setDragging] = useState(false)

  const handleFiles = async (files) => {
    if (!files || files.length === 0) return
    setUploading(true)
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData()
        formData.append('image', file)
        const res = await axiosInstance.post('/upload/image', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        onUpload?.(res.data.url || res.data.path)
      }
    } catch (err) {
      // Use local URL as fallback for demo
      for (const file of Array.from(files)) {
        const url = URL.createObjectURL(file)
        onUpload?.(url)
      }
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  return (
    <div>
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
          dragging ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
        }`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <div className="flex flex-col items-center gap-2">
          {uploading ? (
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Upload size={32} className="text-gray-400" />
          )}
          <p className="text-sm text-gray-500">{t('products.dragDropImages')}</p>
        </div>
      </div>

      {currentImages.length > 0 && (
        <div className="grid grid-cols-4 gap-3 mt-4">
          {currentImages.map((img, idx) => (
            <div
              key={idx}
              className={`relative rounded-xl overflow-hidden border-2 group ${
                img.is_primary || idx === 0 ? 'border-blue-500' : 'border-gray-200'
              }`}
            >
              {img.url || typeof img === 'string' ? (
                <img
                  src={typeof img === 'string' ? img : img.url}
                  alt=""
                  className="w-full h-24 object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none'
                    e.target.nextSibling.style.display = 'flex'
                  }}
                />
              ) : null}
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
                    onClick={() => onSetPrimary?.(idx)}
                    className="bg-white/90 text-blue-600 rounded-lg p-1.5 hover:bg-white"
                    title={t('products.setPrimary')}
                  >
                    <Star size={14} />
                  </button>
                )}
                <button
                  onClick={() => onDelete?.(idx)}
                  className="bg-white/90 text-red-500 rounded-lg p-1.5 hover:bg-white"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ImageUpload
