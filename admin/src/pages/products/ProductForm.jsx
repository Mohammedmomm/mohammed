'use client'
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { Plus, Trash2, GripVertical, X } from 'lucide-react'
import toast from 'react-hot-toast'
import PageHeader from '../../components/shared/PageHeader'
import CategoryTreeSelect from '../../components/shared/CategoryTreeSelect'
import ImageUpload from '../../components/shared/ImageUpload'
import { createProduct, updateProduct, getProduct } from '../../api/products'
import { generateSlug } from '../../utils/slugify'
import useSettingsStore from '../../store/settingsStore'
import axiosInstance from '../../api/axiosInstance'

const schema = z.object({
  name_ar: z.string().min(1, 'مطلوب'),
  name_en: z.string().min(1, 'Required'),
  slug: z.string().min(1, 'Required'),
  category_id: z.any().optional(),
  brand_id: z.any().optional(),
  price_syp: z.coerce.number().min(0).optional(),
  price_usd: z.coerce.number().min(0).optional(),
  description_ar: z.string().optional(),
  description_en: z.string().optional(),
  is_featured: z.boolean().optional(),
  is_available: z.boolean().optional(),
  has_variants: z.boolean().optional(),
  has_details: z.boolean().optional(),
})

const TABS = ['basicInfo', 'pricing', 'description', 'images', 'specifications', 'variants']

const ProductForm = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = !!id
  const [activeTab, setActiveTab] = useState(0)
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState([])
  const [variants, setVariants] = useState([])
  const [tags, setTags] = useState([])
  const [tagInput, setTagInput] = useState('')
  const [categoryId, setCategoryId] = useState(null)
  const [brandsList, setBrandsList] = useState([])
  const [specTemplates, setSpecTemplates] = useState([])
  const [specValues, setSpecValues] = useState({})
  const exchangeRate = useSettingsStore((s) => s.exchangeRate)

  useEffect(() => {
    axiosInstance.get('/brands?limit=200')
      .then((res) => {
        const d = res.data?.data
        setBrandsList(Array.isArray(d) ? d : (d?.data || []))
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!categoryId) { setSpecTemplates([]); return }
    axiosInstance.get(`/specifications/templates/category/${categoryId}`)
      .then((res) => {
        const rows = res.data?.data || []
        setSpecTemplates(rows.map((r) => ({
          ...r,
          options: Array.isArray(r.options)
            ? r.options
            : r.options ? JSON.parse(r.options) : [],
        })))
      })
      .catch(() => setSpecTemplates([]))
  }, [categoryId])

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      is_available: true,
      is_featured: false,
      has_variants: false,
      has_details: false,
    },
  })

  const hasVariants = watch('has_variants')
  const priceSYP = watch('price_syp')
  const priceUSD = watch('price_usd')
  const nameEn = watch('name_en')

  // Auto-generate slug only when creating a new product
  useEffect(() => {
    if (!isEdit && nameEn) setValue('slug', generateSlug(nameEn))
  }, [nameEn])

  useEffect(() => {
    if (!isEdit || !id) return
    getProduct(id)
      .then((res) => {
        const p = res.data?.data || res.data
        Object.keys(schema.shape).forEach((k) => {
          if (p[k] !== undefined) setValue(k, p[k])
        })
        if (p.category_id) setCategoryId(p.category_id)

        // Normalize images from DB shape
        if (p.images?.length) {
          setImages(p.images.map((img) => ({
            url: img.image_url || img.url,
            is_primary: img.is_primary || false,
          })))
        }

        // Normalize variants from DB shape
        if (p.variants?.length) {
          setVariants(p.variants.map((v) => ({
            id: v.id,
            label_ar: v.variant_label_ar || v.label_ar || '',
            label_en: v.variant_label_en || v.label_en || '',
            price_syp: v.price_syp || '',
          })))
        }

        if (Array.isArray(p.tags)) setTags(p.tags)

        // Load existing spec values
        if (p.specifications?.length) {
          const sv = {}
          p.specifications.forEach((s) => { sv[s.field_key] = s.value_ar || s.value_en || '' })
          setSpecValues(sv)
        }
      })
      .catch(() => {})
  }, [id])

  const calcFromSYP = () => {
    if (priceSYP && exchangeRate) setValue('price_usd', +(priceSYP / exchangeRate).toFixed(2))
  }

  const calcFromUSD = () => {
    if (priceUSD && exchangeRate) setValue('price_syp', Math.round(priceUSD * exchangeRate))
  }

  const addTag = () => {
    const tag = tagInput.trim()
    if (tag && !tags.includes(tag)) { setTags([...tags, tag]); setTagInput('') }
  }

  const addVariant = () => {
    setVariants([...variants, { id: `new_${Date.now()}`, label_ar: '', label_en: '', price_syp: '' }])
  }

  const updateVariant = (varId, field, val) => {
    setVariants((prev) => prev.map((v) => (v.id === varId ? { ...v, [field]: val } : v)))
  }

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const payload = {
        name_ar: data.name_ar,
        name_en: data.name_en,
        description_ar: data.description_ar || null,
        description_en: data.description_en || null,
        category_id: categoryId || null,
        brand_id: data.brand_id ? Number(data.brand_id) : null,
        price_syp: data.price_syp > 0 ? data.price_syp : null,
        price_usd: data.price_usd > 0 ? data.price_usd : null,
        has_variants: data.has_variants || false,
        has_details: data.has_details !== false,
        is_available: data.is_available !== false,
        is_featured: data.is_featured || false,
        tags: tags.length > 0 ? tags : null,
      }

      let productId = id
      if (isEdit) {
        await updateProduct(id, payload)
      } else {
        const res = await createProduct(payload)
        productId = res.data?.data?.id || res.data?.id
      }

      // Save images
      await axiosInstance.post(`/products/${productId}/images/sync`, {
        images: images.map((img, i) => ({
          image_url: img.url,
          is_primary: img.is_primary || i === 0,
        })),
      }).catch(() => {})

      // Save variants
      if (data.has_variants && variants.length > 0) {
        await axiosInstance.post(`/products/${productId}/variants/sync`, {
          variants: variants
            .filter((v) => v.label_ar || v.label_en)
            .map((v) => ({
              variant_label_ar: v.label_ar,
              variant_label_en: v.label_en,
              price_syp: Number(v.price_syp) > 0 ? Number(v.price_syp) : null,
            })),
        }).catch(() => {})
      }

      // Save specs
      const specs = specTemplates
        .filter((tmpl) => specValues[tmpl.field_key] !== undefined && specValues[tmpl.field_key] !== '')
        .map((tmpl) => ({
          field_key: tmpl.field_key,
          value_ar: String(specValues[tmpl.field_key]),
          value_en: String(specValues[tmpl.field_key]),
          unit: tmpl.unit || null,
        }))
      if (specs.length > 0) {
        await axiosInstance.put(`/specifications/product/${productId}`, { specs }).catch(() => {})
      }

      toast.success(isEdit ? t('products.productUpdated') : t('products.productCreated'))
      navigate('/products')
    } catch (err) {
      const msg = err?.response?.data?.error || 'حدث خطأ، حاول مجدداً'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const tabLabels = TABS.map((k) => t(`products.${k}`))

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title={isEdit ? t('products.editProduct') : t('products.newProduct')}
        actions={[
          { label: t('common.cancel'), variant: 'secondary', onClick: () => navigate('/products') },
          { label: loading ? t('common.loading') : t('common.save'), onClick: handleSubmit(onSubmit) },
        ]}
      />

      {/* Tabs */}
      <div className="bg-white rounded-xl card-shadow overflow-hidden">
        <div className="flex border-b border-gray-100 overflow-x-auto">
          {tabLabels.map((label, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              className={`px-5 py-3.5 text-sm font-medium whitespace-nowrap transition-all border-b-2 ${
                activeTab === i
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Tab 0: Basic Info */}
          {activeTab === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('products.productNameAr')} *</label>
                <input {...register('name_ar')} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm" dir="rtl" />
                {errors.name_ar && <p className="text-xs text-red-500 mt-1">{errors.name_ar.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('products.productNameEn')} *</label>
                <input {...register('name_en')} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm" dir="ltr" />
                {errors.name_en && <p className="text-xs text-red-500 mt-1">{errors.name_en.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('products.slug')}</label>
                <input {...register('slug')} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm font-mono bg-gray-50" dir="ltr" />
                {errors.slug && <p className="text-xs text-red-500 mt-1">{errors.slug.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('products.brand')}</label>
                <select {...register('brand_id')} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white">
                  <option value="">{t('common.select')}</option>
                  {brandsList.map((b) => (
                    <option key={b.id} value={b.id}>{b.name_ar || b.name_en || b.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('products.category')}</label>
                <CategoryTreeSelect value={categoryId} onChange={setCategoryId} />
              </div>
              <div className="md:col-span-2 flex flex-wrap gap-6 pt-2">
                {[
                  { name: 'is_available', label: t('products.isAvailable') },
                  { name: 'is_featured', label: t('products.isFeatured') },
                  { name: 'has_variants', label: t('products.hasVariants') },
                  { name: 'has_details', label: t('products.hasDetails') },
                ].map((f) => (
                  <label key={f.name} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" {...register(f.name)} className="rounded border-gray-300 text-blue-500" />
                    <span className="text-sm text-gray-700">{f.label}</span>
                  </label>
                ))}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('products.tags')}</label>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    placeholder={t('products.addTag')}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm"
                  />
                  <button type="button" onClick={addTag} className="px-3 py-2 text-white rounded-xl text-sm" style={{ backgroundColor: '#1E6FBF' }}>
                    {t('common.add')}
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span key={tag} className="flex items-center gap-1 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm">
                      {tag}
                      <button type="button" onClick={() => setTags(tags.filter((tg) => tg !== tag))} className="hover:text-red-500">
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 1: Pricing */}
          {activeTab === 1 && (
            <div className="space-y-5">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <span className="text-sm text-blue-700">
                  {t('products.currentExchangeRate')}: <strong>{exchangeRate?.toLocaleString()} ل.س / دولار</strong>
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('products.priceSYP')}</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="0"
                      {...register('price_syp')}
                      className="flex-1 px-3 py-2.5 border border-gray-200 rounded-xl text-sm"
                      placeholder="0"
                    />
                    <button type="button" onClick={calcFromSYP} className="px-3 py-2 text-xs border border-gray-200 rounded-xl text-blue-600 hover:bg-blue-50 whitespace-nowrap">
                      {t('products.calculateFromSYP')}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('products.priceUSD')}</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      {...register('price_usd')}
                      className="flex-1 px-3 py-2.5 border border-gray-200 rounded-xl text-sm"
                      placeholder="0.00"
                    />
                    <button type="button" onClick={calcFromUSD} className="px-3 py-2 text-xs border border-gray-200 rounded-xl text-blue-600 hover:bg-blue-50 whitespace-nowrap">
                      {t('products.calculateFromUSD')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Description */}
          {activeTab === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('products.descriptionAr')}</label>
                <textarea
                  {...register('description_ar')}
                  rows={10}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm resize-none"
                  dir="rtl"
                  placeholder="الوصف بالعربية..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('products.descriptionEn')}</label>
                <textarea
                  {...register('description_en')}
                  rows={10}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm resize-none"
                  dir="ltr"
                  placeholder="Description in English..."
                />
              </div>
            </div>
          )}

          {/* Tab 3: Images */}
          {activeTab === 3 && (
            <ImageUpload
              multiple
              currentImages={images}
              onUpload={(url) => setImages((prev) => [...prev, { url, is_primary: prev.length === 0 }])}
              onDelete={(idx) => setImages((prev) => prev.filter((_, i) => i !== idx))}
              onSetPrimary={(idx) => setImages((prev) => prev.map((img, i) => ({ ...img, is_primary: i === idx })))}
            />
          )}

          {/* Tab 4: Specifications */}
          {activeTab === 4 && (
            <div>
              {!categoryId ? (
                <div className="text-center py-12 text-gray-400">
                  <p>اختر التصنيف أولاً من تبويب المعلومات الأساسية</p>
                </div>
              ) : specTemplates.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <p>لا توجد مواصفات محددة لهذا التصنيف</p>
                  <p className="text-xs mt-1">أضف قوالب مواصفات من قسم قوالب المواصفات</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {specTemplates.map((tmpl) => (
                    <div key={tmpl.id}>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        {tmpl.label_ar}
                        {tmpl.label_en && <span className="text-gray-400 text-xs mr-1">/ {tmpl.label_en}</span>}
                        {tmpl.unit && <span className="text-gray-400 text-xs mr-1">({tmpl.unit})</span>}
                        {tmpl.is_required && <span className="text-red-400 mr-1">*</span>}
                      </label>
                      {tmpl.field_type === 'select' ? (
                        <select
                          value={specValues[tmpl.field_key] || ''}
                          onChange={(e) => setSpecValues((prev) => ({ ...prev, [tmpl.field_key]: e.target.value }))}
                          className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white"
                        >
                          <option value="">اختر...</option>
                          {(tmpl.options || []).map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : tmpl.field_type === 'boolean' ? (
                        <label className="flex items-center gap-2 cursor-pointer mt-1">
                          <input
                            type="checkbox"
                            checked={specValues[tmpl.field_key] === 'true' || specValues[tmpl.field_key] === true}
                            onChange={(e) => setSpecValues((prev) => ({ ...prev, [tmpl.field_key]: e.target.checked ? 'true' : 'false' }))}
                            className="rounded border-gray-300 text-blue-500 w-4 h-4"
                          />
                          <span className="text-sm text-gray-600">نعم / Yes</span>
                        </label>
                      ) : tmpl.field_type === 'textarea' ? (
                        <textarea
                          value={specValues[tmpl.field_key] || ''}
                          onChange={(e) => setSpecValues((prev) => ({ ...prev, [tmpl.field_key]: e.target.value }))}
                          rows={3}
                          className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm resize-none"
                        />
                      ) : (
                        <input
                          type={tmpl.field_type === 'number' ? 'number' : 'text'}
                          value={specValues[tmpl.field_key] || ''}
                          onChange={(e) => setSpecValues((prev) => ({ ...prev, [tmpl.field_key]: e.target.value }))}
                          className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 5: Variants */}
          {activeTab === 5 && (
            <div>
              {!hasVariants ? (
                <div className="text-center py-8 text-gray-400 text-sm">
                  فعّل خيار "يحتوي على متغيرات" في تبويب المعلومات الأساسية أولاً.
                </div>
              ) : (
                <div className="space-y-3">
                  {variants.length === 0 && (
                    <p className="text-gray-400 text-sm py-4">{t('products.noVariants')}</p>
                  )}
                  {variants.map((v) => (
                    <div key={v.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl bg-gray-50">
                      <GripVertical size={16} className="text-gray-300 cursor-grab flex-shrink-0" />
                      <input
                        value={v.label_ar}
                        onChange={(e) => updateVariant(v.id, 'label_ar', e.target.value)}
                        placeholder={t('products.variantLabelAr')}
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
                        dir="rtl"
                      />
                      <input
                        value={v.label_en}
                        onChange={(e) => updateVariant(v.id, 'label_en', e.target.value)}
                        placeholder={t('products.variantLabelEn')}
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
                        dir="ltr"
                      />
                      <input
                        value={v.price_syp}
                        onChange={(e) => updateVariant(v.id, 'price_syp', e.target.value)}
                        placeholder={t('products.variantPrice')}
                        type="number"
                        min="0"
                        className="w-32 px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => setVariants((prev) => prev.filter((x) => x.id !== v.id))}
                        className="text-red-400 hover:text-red-600 flex-shrink-0"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addVariant}
                    className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-300 rounded-xl text-sm text-gray-600 hover:border-blue-400 hover:text-blue-600 w-full justify-center transition-colors"
                  >
                    <Plus size={16} />
                    {t('products.addVariant')}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Save */}
      <div className="flex justify-end gap-3 pb-6">
        <button
          type="button"
          onClick={() => navigate('/products')}
          className="px-6 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50"
        >
          {t('common.cancel')}
        </button>
        <button
          type="button"
          onClick={handleSubmit(onSubmit)}
          disabled={loading}
          className="px-6 py-2.5 text-white rounded-xl text-sm font-medium disabled:opacity-50"
          style={{ backgroundColor: '#1E6FBF' }}
        >
          {loading ? t('common.loading') : t('common.save')}
        </button>
      </div>
    </div>
  )
}

export default ProductForm
