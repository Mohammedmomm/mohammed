import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, Edit2, Trash2, X, Save, Image as ImageIcon, MousePointer } from 'lucide-react'
import toast from 'react-hot-toast'
import PageHeader from '../components/shared/PageHeader'
import ConfirmDialog from '../components/shared/ConfirmDialog'
import axiosInstance from '../api/axiosInstance'

const POSITIONS = ['hero', 'sidebar', 'between_products', 'footer_banner', 'popup', 'category_top']

const positionColors = {
  hero: '#1E6FBF',
  sidebar: '#F47920',
  between_products: '#22C55E',
  footer_banner: '#8B5CF6',
  popup: '#F59E0B',
  category_top: '#EF4444',
}

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

  const handleSave = async () => {
    if (!form.title_ar) { toast.error('العنوان مطلوب'); return }
    setSaving(true)
    try {
      if (ad?.id) {
        await axiosInstance.put(`/ads/${ad.id}`, form)
        toast.success(t('ads.editAd') + ' ✓')
      } else {
        await axiosInstance.post('/ads', form)
        toast.success(t('ads.addAd') + ' ✓')
      }
      onSave()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'حدث خطأ')
    } finally {
      setSaving(false)
    }
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
  const [ads, setAds] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const fetchAds = useCallback(async () => {
    setLoading(true)
    try {
      const res = await axiosInstance.get('/ads')
      setAds(res.data.data || [])
    } catch (err) {
      toast.error(err?.response?.data?.message || 'فشل تحميل الإعلانات')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchAds() }, [fetchAds])

  const handleSave = () => {
    setModal(null)
    fetchAds()
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await axiosInstance.delete(`/ads/${deleteTarget.id}`)
      toast.success(t('ads.deleteAd') + ' ✓')
      fetchAds()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'فشل الحذف')
    } finally {
      setDeleting(false)
      setDeleteTarget(null)
    }
  }

  const toggleActive = async (id) => {
    try {
      await axiosInstance.patch(`/ads/${id}/toggle`)
      fetchAds()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'فشل تغيير الحالة')
    }
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title={t('nav.advertisements')}
        subtitle={`${ads.filter((a) => a.is_active).length} نشط من ${ads.length}`}
        actions={[{ label: t('ads.addAd'), icon: Plus, onClick: () => setModal({}) }]}
      />

      {loading ? (
        <div className="text-center py-12 text-gray-400">{t('common.loading')}</div>
      ) : (
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
      )}

      {modal !== null && (
        <AdModal ad={Object.keys(modal).length ? modal : null} onSave={handleSave} onClose={() => setModal(null)} />
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title={t('ads.deleteAd')}
        message={t('ads.confirmDelete')}
        confirmText={t('common.delete')}
        danger
      />
    </div>
  )
}

export default Advertisements
