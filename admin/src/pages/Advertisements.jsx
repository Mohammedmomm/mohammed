import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, Edit2, Trash2, X, Save, Image as ImageIcon, MousePointer } from 'lucide-react'
import toast from 'react-hot-toast'
import PageHeader from '../components/shared/PageHeader'
import ConfirmDialog from '../components/shared/ConfirmDialog'

const POSITIONS = ['hero', 'sidebar', 'between_products', 'footer_banner', 'popup', 'category_top']

const positionColors = {
  hero: '#1E6FBF',
  sidebar: '#F47920',
  between_products: '#22C55E',
  footer_banner: '#8B5CF6',
  popup: '#F59E0B',
  category_top: '#EF4444',
}

const initialAds = [
  { id: 1, title_ar: 'عرض كابلات HDMI 4K', title_en: '4K HDMI Cable Offer', description: 'وفر 20% على كابلات HDMI', link_url: '/products/hdmi', position: 'hero', start_date: '2024-06-01', end_date: '2024-07-01', click_count: 354, is_active: true, image_url: '' },
  { id: 2, title_ar: 'تخفيضات أجهزة صوتية', title_en: 'Audio Devices Sale', description: 'خصم 15% على الأجهزة الصوتية', link_url: '/products/audio', position: 'sidebar', start_date: '2024-06-01', end_date: '2024-06-30', click_count: 218, is_active: true, image_url: '' },
  { id: 3, title_ar: 'وصل جديد: كابلات فايبر', title_en: 'New: Fiber Cables', description: 'كابلات الألياف الضوئية الجديدة', link_url: '/products/fiber', position: 'popup', start_date: '2024-06-15', end_date: '2024-07-15', click_count: 195, is_active: true, image_url: '' },
  { id: 4, title_ar: 'عروض صيف 2024', title_en: 'Summer 2024 Offers', description: 'أفضل العروض الصيفية', link_url: '/offers', position: 'footer_banner', start_date: '2024-06-01', end_date: '2024-08-31', click_count: 104, is_active: false, image_url: '' },
  { id: 5, title_ar: 'محولات USB-C الجديدة', title_en: 'New USB-C Adapters', description: 'شاهد مجموعتنا من محولات USB-C', link_url: '/products/usb-c', position: 'category_top', start_date: '2024-07-01', end_date: '2024-07-31', click_count: 87, is_active: true, image_url: '' },
]

const AdModal = ({ ad, onSave, onClose }) => {
  const { t } = useTranslation()
  const [form, setForm] = useState({
    title_ar: ad?.title_ar || '',
    title_en: ad?.title_en || '',
    description: ad?.description || '',
    link_url: ad?.link_url || '',
    position: ad?.position || 'hero',
    start_date: ad?.start_date || '',
    end_date: ad?.end_date || '',
    is_active: ad?.is_active ?? true,
    image_url: ad?.image_url || '',
  })
  const [saving, setSaving] = useState(false)

  const handleSave = () => {
    if (!form.title_ar) { toast.error('العنوان مطلوب'); return }
    setSaving(true)
    setTimeout(() => {
      onSave({ ...ad, ...form, id: ad?.id || Date.now(), click_count: ad?.click_count || 0 })
      setSaving(false)
    }, 400)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-6 animate-fade-in max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-gray-800 text-lg">{ad ? t('ads.editAd') : t('ads.addAd')}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><X size={16} /></button>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">{t('ads.adTitleAr')} *</label>
              <input value={form.title_ar} onChange={(e) => setForm({ ...form, title_ar: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm" dir="rtl" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">{t('ads.adTitleEn')}</label>
              <input value={form.title_en} onChange={(e) => setForm({ ...form, title_en: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm" dir="ltr" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">{t('ads.adDescription')}</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm resize-none" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">{t('ads.linkUrl')}</label>
            <input value={form.link_url} onChange={(e) => setForm({ ...form, link_url: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm" dir="ltr" placeholder="https://..." />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">{t('ads.position')}</label>
            <select value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white">
              {POSITIONS.map((p) => <option key={p} value={p}>{t(`ads.positions.${p}`)}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">{t('ads.startDate')}</label>
              <input type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">{t('ads.endDate')}</label>
              <input type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">{t('ads.adImage')}</label>
            <input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm" dir="ltr" placeholder="https://..." />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="rounded border-gray-300 text-blue-500" />
            <span className="text-sm text-gray-700">{t('ads.active')}</span>
          </label>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600">{t('common.cancel')}</button>
          <button onClick={handleSave} disabled={saving} className="flex-1 py-2.5 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50" style={{ backgroundColor: '#1E6FBF' }}>
            <Save size={14} />
            {saving ? t('common.loading') : t('common.save')}
          </button>
        </div>
      </div>
    </div>
  )
}

const Advertisements = () => {
  const { t } = useTranslation()
  const [ads, setAds] = useState(initialAds)
  const [modal, setModal] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const handleSave = (ad) => {
    if (ads.find((a) => a.id === ad.id)) {
      setAds((prev) => prev.map((a) => (a.id === ad.id ? ad : a)))
      toast.success(t('ads.editAd') + ' ✓')
    } else {
      setAds((prev) => [...prev, ad])
      toast.success(t('ads.addAd') + ' ✓')
    }
    setModal(null)
  }

  const handleDelete = () => {
    setAds((prev) => prev.filter((a) => a.id !== deleteTarget.id))
    toast.success(t('ads.deleteAd') + ' ✓')
    setDeleteTarget(null)
  }

  const toggleActive = (id) => {
    setAds((prev) => prev.map((a) => (a.id === id ? { ...a, is_active: !a.is_active } : a)))
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title={t('nav.advertisements')}
        subtitle={`${ads.filter((a) => a.is_active).length} نشط من ${ads.length}`}
        actions={[{ label: t('ads.addAd'), icon: Plus, onClick: () => setModal({}) }]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {ads.map((ad) => (
          <div key={ad.id} className={`bg-white rounded-2xl card-shadow overflow-hidden border-2 transition-all ${ad.is_active ? 'border-transparent' : 'border-gray-200 opacity-70'}`}>
            {/* Image Placeholder */}
            <div className="h-36 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative">
              {ad.image_url ? (
                <img src={ad.image_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <ImageIcon size={32} className="text-gray-300" />
              )}
              <div className="absolute top-3 start-3">
                <span
                  className="text-white text-xs px-2.5 py-1 rounded-full font-medium"
                  style={{ backgroundColor: positionColors[ad.position] }}
                >
                  {t(`ads.positions.${ad.position}`)}
                </span>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 text-sm truncate">{ad.title_ar}</p>
                  <p className="text-xs text-gray-400 truncate">{ad.title_en}</p>
                </div>
                <button
                  onClick={() => toggleActive(ad.id)}
                  className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ms-2 ${ad.is_active ? 'bg-green-500' : 'bg-gray-300'}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${ad.is_active ? 'end-0.5' : 'start-0.5'}`} />
                </button>
              </div>
              {ad.description && <p className="text-xs text-gray-500 mb-3 line-clamp-2">{ad.description}</p>}
              <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                <span>{ad.start_date} → {ad.end_date || '—'}</span>
                <span className="flex items-center gap-1">
                  <MousePointer size={10} />
                  {ad.click_count} نقرة
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setModal(ad)}
                  className="flex-1 py-1.5 text-xs border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-1"
                >
                  <Edit2 size={12} /> {t('common.edit')}
                </button>
                <button
                  onClick={() => setDeleteTarget(ad)}
                  className="py-1.5 px-3 text-xs border border-red-200 rounded-lg text-red-400 hover:bg-red-50 flex items-center gap-1"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modal !== null && (
        <AdModal ad={Object.keys(modal).length ? modal : null} onSave={handleSave} onClose={() => setModal(null)} />
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title={t('ads.deleteAd')}
        message={t('ads.confirmDelete')}
        confirmText={t('common.delete')}
        danger
      />
    </div>
  )
}

export default Advertisements
