import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, Edit2, Trash2, X, Save, Tag } from 'lucide-react'
import toast from 'react-hot-toast'
import PageHeader from '../components/shared/PageHeader'
import ConfirmDialog from '../components/shared/ConfirmDialog'

const initialBrands = [
  { id: 1, name_ar: 'سامسونج', name_en: 'Samsung', logo_url: '', product_count: 142, is_active: true },
  { id: 2, name_ar: 'أنكر', name_en: 'Anker', logo_url: '', product_count: 98, is_active: true },
  { id: 3, name_ar: 'تي بي لينك', name_en: 'TP-Link', logo_url: '', product_count: 76, is_active: true },
  { id: 4, name_ar: 'يوغرين', name_en: 'Ugreen', logo_url: '', product_count: 65, is_active: true },
  { id: 5, name_ar: 'جي بي ال', name_en: 'JBL', logo_url: '', product_count: 43, is_active: false },
  { id: 6, name_ar: 'كي نت', name_en: 'K-Net', logo_url: '', product_count: 89, is_active: true },
  { id: 7, name_ar: 'بلفكين', name_en: 'Belkin', logo_url: '', product_count: 54, is_active: true },
  { id: 8, name_ar: 'كيبل ماتيز', name_en: 'Cable Matters', logo_url: '', product_count: 31, is_active: true },
]

const BrandModal = ({ brand, onSave, onClose }) => {
  const { t } = useTranslation()
  const [form, setForm] = useState({
    name_ar: brand?.name_ar || '',
    name_en: brand?.name_en || '',
    logo_url: brand?.logo_url || '',
    is_active: brand?.is_active ?? true,
  })
  const [saving, setSaving] = useState(false)

  const handleSave = () => {
    if (!form.name_ar || !form.name_en) { toast.error('الاسم مطلوب'); return }
    setSaving(true)
    setTimeout(() => {
      onSave({ ...brand, ...form, id: brand?.id || Date.now(), product_count: brand?.product_count || 0 })
      setSaving(false)
    }, 400)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 animate-fade-in">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-gray-800 text-lg">
            {brand ? t('brands.editBrand') : t('brands.addBrand')}
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><X size={16} /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">{t('brands.brandNameAr')} *</label>
            <input value={form.name_ar} onChange={(e) => setForm({ ...form, name_ar: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm" dir="rtl" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">{t('brands.brandNameEn')} *</label>
            <input value={form.name_en} onChange={(e) => setForm({ ...form, name_en: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm" dir="ltr" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">{t('brands.logoUrl')}</label>
            <input value={form.logo_url} onChange={(e) => setForm({ ...form, logo_url: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm" placeholder="https://..." dir="ltr" />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="rounded border-gray-300 text-blue-500" />
            <span className="text-sm text-gray-700">{t('common.active')}</span>
          </label>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">{t('common.cancel')}</button>
          <button onClick={handleSave} disabled={saving} className="flex-1 py-2.5 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50" style={{ backgroundColor: '#1E6FBF' }}>
            <Save size={14} />
            {saving ? t('common.loading') : t('common.save')}
          </button>
        </div>
      </div>
    </div>
  )
}

const Brands = () => {
  const { t } = useTranslation()
  const [brands, setBrands] = useState(initialBrands)
  const [modal, setModal] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const handleSave = (brand) => {
    if (brand.id && brands.find((b) => b.id === brand.id)) {
      setBrands((prev) => prev.map((b) => (b.id === brand.id ? brand : b)))
      toast.success(t('brands.editBrand') + ' ✓')
    } else {
      setBrands((prev) => [...prev, brand])
      toast.success(t('brands.addBrand') + ' ✓')
    }
    setModal(null)
  }

  const handleDelete = () => {
    setBrands((prev) => prev.filter((b) => b.id !== deleteTarget.id))
    toast.success(t('brands.deleteBrand') + ' ✓')
    setDeleteTarget(null)
  }

  const toggleActive = (id) => {
    setBrands((prev) => prev.map((b) => (b.id === id ? { ...b, is_active: !b.is_active } : b)))
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title={t('nav.brands')}
        subtitle={`${brands.length} ${t('common.total')}`}
        actions={[{ label: t('brands.addBrand'), icon: Plus, onClick: () => setModal({}) }]}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {brands.map((brand) => (
          <div key={brand.id} className="bg-white rounded-2xl card-shadow p-5 hover:shadow-md transition-shadow group">
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
                {brand.logo_url ? (
                  <img src={brand.logo_url} alt={brand.name_en} className="w-full h-full object-contain" onError={(e) => e.target.style.display = 'none'} />
                ) : (
                  <Tag size={24} className="text-gray-400" />
                )}
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => setModal(brand)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500"><Edit2 size={13} /></button>
                <button onClick={() => setDeleteTarget(brand)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400"><Trash2 size={13} /></button>
              </div>
            </div>
            <p className="font-semibold text-gray-800">{brand.name_ar}</p>
            <p className="text-sm text-gray-400 mb-3">{brand.name_en}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">{brand.product_count} منتج</span>
              <button
                onClick={() => toggleActive(brand.id)}
                className={`relative w-9 h-5 rounded-full transition-colors ${brand.is_active ? 'bg-green-500' : 'bg-gray-300'}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${brand.is_active ? 'end-0.5' : 'start-0.5'}`} />
              </button>
            </div>
          </div>
        ))}

        {/* Add Card */}
        <button
          onClick={() => setModal({})}
          className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-5 flex flex-col items-center justify-center gap-2 hover:border-blue-400 hover:bg-blue-50/30 transition-all group min-h-36"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
            <Plus size={20} style={{ color: '#1E6FBF' }} />
          </div>
          <span className="text-sm text-gray-500 group-hover:text-blue-600">{t('brands.addBrand')}</span>
        </button>
      </div>

      {modal !== null && (
        <BrandModal brand={Object.keys(modal).length ? modal : null} onSave={handleSave} onClose={() => setModal(null)} />
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title={t('brands.deleteBrand')}
        message={t('brands.confirmDelete')}
        confirmText={t('common.delete')}
        danger
      />
    </div>
  )
}

export default Brands
