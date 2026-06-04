'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { getProduct } from '@/lib/api'
import { trackProductView } from '@/lib/analytics'
import { useLanguage } from '@/context/LanguageContext'
import { useCurrency } from '@/context/CurrencyContext'
import { getName, getDescription, buildWhatsAppLink } from '@/lib/utils'
import Breadcrumb from '@/components/layout/Breadcrumb'
import ImageGallery from '@/components/products/ImageGallery'
import VariantSelector from '@/components/products/VariantSelector'
import SpecsTable from '@/components/products/SpecsTable'
import SimilarProducts from '@/components/products/SimilarProducts'
import PriceDisplay from '@/components/products/PriceDisplay'
import ShareButtons from '@/components/ui/ShareButtons'
import { MessageCircle, CheckCircle2, XCircle, Tag, Package } from 'lucide-react'

export default function ProductPage() {
  const params = useParams()
  const { lang } = useLanguage()
  const { currency, exchangeRate } = useCurrency()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [settings, setSettings] = useState(null)

  useEffect(() => {
    if (!params.id) return
    setLoading(true)
    getProduct(params.id)
      .then((d) => {
        setProduct(d)
        trackProductView(params.id)
      })
      .catch(() => {})
      .finally(() => setLoading(false))

    import('@/lib/api').then(({ getSettings }) => {
      getSettings().then(setSettings).catch(() => {})
    })
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#0A1628' }}>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="shimmer rounded-xl" style={{ paddingTop: '80%' }} />
            <div className="space-y-4">
              <div className="shimmer h-6 rounded" style={{ width: '75%' }} />
              <div className="shimmer h-4 rounded" style={{ width: '45%' }} />
              <div className="shimmer h-8 rounded" style={{ width: '55%' }} />
              <div className="shimmer h-20 rounded" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0A1628' }}>
        <div className="text-center">
          <p className="text-lg mb-4" style={{ color: '#94A3B8' }}>
            {lang === 'ar' ? 'المنتج غير موجود' : 'Product not found'}
          </p>
          <a href="/" className="px-4 py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: '#00D4FF', color: '#0A1628' }}>
            {lang === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
          </a>
        </div>
      </div>
    )
  }

  const name = getName(product, lang)
  const description = getDescription(product, lang)
  const isAvailable = product.is_available !== false
  const brandName = lang === 'ar'
    ? (product.brand_name_ar || product.brand_name || null)
    : (product.brand_name || product.brand_name_ar || null)
  const images = product.images || []
  const variants = product.variants || []
  const specs = product.specifications || product.specs || []

  const categoryName = lang === 'ar' ? product.category_name_ar : (product.category_name_en || product.category_name_ar)
  const categorySlug = product.category_slug

  const activePriceSYP = selectedVariant?.price_syp ?? product.price_syp
  const activePriceUSD = selectedVariant?.price_usd ?? product.price_usd

  const whatsappMessage = lang === 'ar'
    ? `مرحباً، أريد الاستفسار عن: ${name}`
    : `Hello, I'd like to inquire about: ${name}`
  const whatsappLink = buildWhatsAppLink(settings?.whatsapp_number || settings?.phone_number || '', whatsappMessage)

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0A1628' }}>
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Breadcrumb
            items={[
              { label: lang === 'ar' ? 'الرئيسية' : 'Home', href: '/' },
              ...(categoryName ? [{ label: categoryName, href: `/category/${categorySlug}` }] : []),
              { label: name, href: '#' },
            ]}
          />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Gallery */}
          <div>
            <ImageGallery images={images} />
          </div>

          {/* Details */}
          <div className="space-y-5">
            {/* Brand */}
            {brandName && (
              <div className="flex items-center gap-2">
                <Tag size={14} style={{ color: '#00D4FF' }} />
                <span className="text-sm font-medium" style={{ color: '#00D4FF' }}>
                  {brandName}
                </span>
              </div>
            )}

            {/* Name */}
            <h1 className="text-2xl sm:text-3xl font-bold leading-snug" style={{ color: '#F8F9FA' }}>
              {name}
            </h1>

            {/* Availability */}
            <div className="flex items-center gap-2">
              {isAvailable ? (
                <>
                  <CheckCircle2 size={16} style={{ color: '#22C55E' }} />
                  <span className="text-sm font-medium" style={{ color: '#22C55E' }}>
                    {lang === 'ar' ? 'متوفر' : 'In Stock'}
                  </span>
                </>
              ) : (
                <>
                  <XCircle size={16} style={{ color: '#EF4444' }} />
                  <span className="text-sm font-medium" style={{ color: '#EF4444' }}>
                    {lang === 'ar' ? 'غير متوفر' : 'Out of Stock'}
                  </span>
                </>
              )}
              {product.sku && (
                <span className="text-xs ms-3" style={{ color: '#94A3B8' }}>
                  SKU: {product.sku}
                </span>
              )}
            </div>

            {/* Price */}
            <div className="py-3 border-y" style={{ borderColor: '#162440' }}>
              <PriceDisplay
                price_syp={activePriceSYP}
                price_usd={activePriceUSD}
                currency={currency}
                exchangeRate={exchangeRate}
                size="lg"
              />
            </div>

            {/* Variants */}
            {variants.length > 0 && (
              <VariantSelector
                variants={variants}
                selectedVariant={selectedVariant}
                onSelect={setSelectedVariant}
                currency={currency}
                exchangeRate={exchangeRate}
              />
            )}

            {/* Description */}
            {description && (
              <div>
                <h3 className="text-sm font-semibold mb-1" style={{ color: '#94A3B8' }}>
                  {lang === 'ar' ? 'الوصف' : 'Description'}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: '#F8F9FA' }}>
                  {description}
                </p>
              </div>
            )}

            {/* WhatsApp CTA */}
            {(settings?.whatsapp_number || settings?.phone_number) && (
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-base transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#22C55E', color: '#fff' }}
              >
                <MessageCircle size={20} />
                {lang === 'ar' ? 'استفسر عبر واتساب' : 'Inquire via WhatsApp'}
              </a>
            )}

            {/* Share */}
            <ShareButtons productName={name} />

            {/* Stock quantity */}
            {product.stock != null && product.stock > 0 && (
              <div className="flex items-center gap-2 text-sm" style={{ color: '#94A3B8' }}>
                <Package size={14} />
                <span>
                  {lang === 'ar' ? `الكمية المتوفرة: ${product.stock}` : `Stock: ${product.stock}`}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Specs */}
        {specs.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-bold mb-4" style={{ color: '#F8F9FA' }}>
              {lang === 'ar' ? 'المواصفات التقنية' : 'Technical Specifications'}
            </h2>
            <SpecsTable specifications={specs} />
          </div>
        )}

        {/* Similar products */}
        <SimilarProducts productId={params.id} />
      </div>
    </div>
  )
}
